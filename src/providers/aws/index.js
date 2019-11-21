const Lambda = require("./resources/lambda");
const BaseProvider = require("../baseProvider");
const fs = require("fs");
const path = require("path");
const { generateMappingsFromFiles, getLambdaFiles } = require("../../shared");
const Gateway = require("./resources/gateway");
const { generateUniqueName } = require("../../utils");
const { FILE_NAMES, COMPAT_LAYER_PATH } = require("../../constants");
const FolderNotFoundError = require("../../errors/folderNotFoundError");

class AwsResources extends BaseProvider {
	constructor({ config }) {
		super({ config });
		this.terraformConfiguration = {};
		this.apiGatewayResource = {};
		this.apiGatewayMethod = {};
		this.apiGatewayIntegration = {};
		this.lambdasResources = {};
		this.lambdasPermissions = {};
		this.lambdaZip = {};
	}

	parseParameters(parameters) {
		return Object.keys(parameters).map(parameterKey => {
			return {
				name: parameterKey,
				mandatory: parameters[parameterKey]
			};
		});
	}

	getParametersFromPath(pathname) {
		return pathname
			.split("/")
			.map(pathPart => {
				if (pathPart.includes(":")) {
					return {
						name: pathPart.replace(":", ""),
						mandatory: true
					};
				}
				return undefined;
			})
			.filter(Boolean);
	}

	/**
	 *
	 * @param {import("./declarations").HandleResource} payload
	 */
	handleResource({ pathPart, index, parts, pathname, lambdaName, params }) {
		const isUrlParameter = pathPart.includes(":");
		const currentPathName = pathPart.replace(":", "");
		let urlParameters = [];
		let queryStringParameters = [];
		if (isUrlParameter) {
			urlParameters = this.getParametersFromPath(pathname);
		}
		if (params) {
			queryStringParameters = this.parseParameters(params);
		}
		const gateway = new Gateway(this.config, {
			parentId: index > 0 ? generateUniqueName(parts.slice(0, index)) : undefined,
			pathname: currentPathName,
			isUrlParameter,
			id: generateUniqueName(parts.slice(0, index)),
			params: urlParameters,
			queryStringParams: queryStringParameters,
			lambdaName
		});

		const gatewayResource = gateway.generate();

		this.apiGatewayResource[gatewayResource.resource.uniqueId] = gatewayResource.resource.resource;
		this.apiGatewayMethod[gatewayResource.method.uniqueId] = gatewayResource.method.resource;
		this.apiGatewayIntegration[gatewayResource.method.uniqueId] = gatewayResource.method.resource;
	}

	/*
	 *
	 * @param {Route} routeObject
	 */
	generateResourcesFromRoute(routeObject) {
		routeObject.mappings.forEach(currentRoute => {
			const { params, page, route } = currentRoute;
			const prefix = routeObject.prefix ? routeObject.prefix : "";
			const pathname = prefix + route;
			const lambdaName = page.replace("/", "");
			pathname
				.split("/")
				.filter(Boolean)
				.forEach((pathPart, index, parts) => {
					this.handleResource({
						pathPart,
						index,
						parts,
						pathname,
						lambdaName,
						params
					});
				});
		});
	}

	generateResources(routesObject) {
		if (Array.isArray(routesObject)) {
			routesObject.forEach(this.generateResourcesFromRoute);
		} else {
			this.generateResourcesFromRoute(routesObject);
		}
	}

	/**
	 *
	 * @param {boolean} write
	 * @returns {Promise<{}|*>}
	 */
	async generateGatewayResources(write = false) {
		try {
			const routes = this.config.getRoutes();
			const lambdaPath = this.config.getServerlessPagesPath();
			const files = await getLambdaFiles(lambdaPath);
			const nextRoutes = generateMappingsFromFiles(files);
			const finalRoutes = routes ? [...routes, nextRoutes] : nextRoutes;
			this.generateResources(finalRoutes);

			this.terraformConfiguration = {
				resource: {
					aws_api_gateway_resource: this.apiGatewayResource,
					aws_api_gateway_method: this.apiGatewayMethod,
					aws_api_gateway_integration: this.apiGatewayIntegration
				},
				variable: {
					integrationList: {
						default: Object.keys(this.apiGatewayIntegration).map(key => `aws_api_gateway_integration.${key}`)
					}
				}
			};

			if (write) {
				// eslint-disable-next-line no-console
				console.log(`Generating file ${FILE_NAMES.GATEWAY}`);
				fs.writeFileSync(path.join(process.cwd(), FILE_NAMES.GATEWAY), JSON.stringify(this.terraformConfiguration, null, 4), {
					encoding: "utf-8"
				});
			} else {
				return this.terraformConfiguration;
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	generateLambdaResources(write = false) {
		const buildPath = this.config.getBuildPath();
		const serverlessBuildPath = this.config.getServerlessBuildPath();

		if (fs.existsSync(buildPath + "/lambdas")) {
			fs.rmdirSync(buildPath + "/lambdas");
		}
		// it creates the folder that will contain the lambdas
		fs.mkdirSync(buildPath + "/lambdas");

		return getLambdaFiles(serverlessBuildPath)
			.then(files => {
				files.forEach(file => {
					/**
					 * 1. create a folder with name of the file
					 * 2. copy the next file with a suffix .original.js
					 * 3. create the lambda from the template
					 * 4. copy the compact layer
					 * 5. generate the lambda resource
					 * 6. generate the zip file resource
					 */
					// 1.
					const lambdaName = file.replace(".js", "");
					const lambdaPath = path.resolve(buildPath, "lambdas") + "/" + lambdaName;
					fs.mkdirSync(lambdaPath);

					// 2.
					const newFilename = file.replace(".js", ".original.js");
					fs.copyFileSync(path.resolve(serverlessBuildPath, file), path.resolve(buildPath, "lambdas", lambdaName, newFilename));

					const lambda = new Lambda(this.config, {
						id: lambdaName,
						directoryName: lambdaName
					});
					// 3.
					lambda.emitLambdaFile(lambdaName, buildPath);

					// 4.
					fs.copyFileSync(
						path.resolve(COMPAT_LAYER_PATH, "./compatLayer.js"),
						path.resolve(buildPath, "lambdas", lambdaName, "compatLayer.js")
					);

					// 5.
					const lambdaResource = lambda.generate();
					this.lambdasResources[lambdaResource.properties.resourceUniqueId] = lambdaResource.properties.resource;
					this.lambdasPermissions[lambdaResource.permisssions.permissionUniqueId] = lambdaResource.permissions.resource;
					this.lambdaZip[lambdaResource.zip.uniqueId] = lambdaResource.zip.resource;
				});
				// it gets files that are inside the serverless folder created by next
				fs.readdirSync(serverlessBuildPath);

				let lambdaResources = {
					resource: {
						aws_lambda_function: this.lambdasResources,
						aws_lambda_permission: this.lambdasPermissions
					},
					data: {
						archive_file: this.lambdaZip
					}
				};

				if (write === true) {
					// eslint-disable-next-line no-console
					console.log(`Generating file ${FILE_NAMES.LAMBDAS}`);
					fs.writeFileSync(path.join(process.cwd(), FILE_NAMES.LAMBDAS), JSON.stringify(lambdaResources, null, 4), {
						encoding: "utf-8"
					});
				} else {
					return lambdaResources;
				}
			})
			.catch(() => {
				throw new FolderNotFoundError(serverlessBuildPath);
			});
	}
}

module.exports = AwsResources;
