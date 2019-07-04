const { getRoutes, getLambdaPath } = require("../../configuration");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const { FILE_NAMES } = require("../../constants");
const { generateGatewayResource, generateUniqueId } = require("./resources/terraFormGatewayResource");
const { generateGatewayMethod } = require("./resources/terraFormGatewayMethod");
const { generateGatewayIntegration } = require("./resources/terraFormGatewayIntegration");
const { generateUniqueName } = require("../../utils");
const { generateMappingsFromFiles, getLambdaFiles } = require("../../shared");

/**
 * @typedef {import('../../declarations').terranext.GatewayResources} GatewayResources
 * @typedef {import('../../declarations').terranext.Route} Route
 * @typedef {import('./aws').AWS.Resource} AWS.Resource
 * @typedef {import('./aws').AWS.Method} AWS.Method
 * @typedef {import('./aws').AWS.Integration} AWS.Integration
 */

/**
 * @type {AWS.Resource}
 */
const apiGatewayResource = {};
/**
 * @type {AWS.Method}
 */
const apiGatewayMethod = {};
/**
 * @type {AWS.Integration}
 */
const apiGatewayIntegration = {};

const getParamsFromPath = pathname => {
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
};

const parseParams = params => {
	return Object.keys(params).map(paramKey => {
		return {
			name: paramKey,
			mandatory: params[paramKey]
		};
	});
};

let gatewayResourceId;
let uniqueName;

/**
 *
 * @param {import("./declarations").HandleResource} payload
 */
const handleResource = ({ pathPart, index, parts, pathname, lambdaName, params }) => {
	const isUrlParam = pathPart.includes(":");
	const currentPathName = pathPart.replace(":", "");
	// Generation of the gateway resource
	// we don't generate a gateway resource if the path part is a query string
	uniqueName = generateUniqueName(parts.slice(0, index + 1));

	// has a parent, generate Id of the parent
	if (index > 0) {
		// get the parent Id (generate it, actually)
		const parentId = generateUniqueId(generateUniqueName(parts.slice(0, index)));
		const { uniqueId, resource } = generateGatewayResource({
			id: uniqueName,
			pathname: currentPathName,
			parentId,
			isUrlParam
		});
		gatewayResourceId = uniqueId;
		apiGatewayResource[uniqueId] = resource;
	} else {
		const { uniqueId, resource } = generateGatewayResource({
			id: uniqueName,
			pathname: uniqueName,
			isUrlParam
		});
		gatewayResourceId = uniqueId;
		apiGatewayResource[uniqueId] = resource;
	}

	// last part of the url, here we generate the method and the integration resources
	// also, we have to enter when we have a query string parameter.
	// In this last case, the gateway resource will belong to the father because hasn't been set
	if (index === parts.length - 1) {
		let urlParams = [];
		let queryStringParams = [];
		if (isUrlParam) {
			urlParams = getParamsFromPath(pathname);
		}
		if (params) {
			queryStringParams = parseParams(params);
		}
		const method = generateGatewayMethod({
			uniqueName,
			gatewayResourceId: gatewayResourceId,
			params: urlParams,
			queryStringParams
		});

		apiGatewayMethod[method.uniqueId] = method.resource;

		const integration = generateGatewayIntegration({
			id: uniqueName,
			gatewayResourceId: gatewayResourceId,
			lambdaName,
			params: urlParams,
			queryStringParams
		});
		apiGatewayIntegration[integration.uniqueId] = integration.resource;
	}
};

const generateResources = routesObject => {
	if (Array.isArray(routesObject)) {
		routesObject.forEach(generateResourcesFromRoute);
	} else {
		generateResourcesFromRoute(routesObject);
	}
};

/**
 *
const generateResourcesFromRoute = currentRoute => {
 * @param {Route} routeObject
 */
const generateResourcesFromRoute = routeObject => {
	routeObject.mappings.forEach(currentRoute => {
		const { params, page, route } = currentRoute;
		const prefix = routeObject.prefix ? routeObject.prefix : "";
		const pathname = prefix + route;
		const lambdaName = page.replace("/", "");
		pathname
			.split("/")
			.filter(Boolean)
			.forEach((pathPart, index, parts) => {
				handleResource({
					pathPart,
					index,
					parts,
					pathname,
					lambdaName,
					params
				});
			});
	});
};

let terraformConfiguration;

/**
 * Generates the terraform configuration for the API Gateway
 *
 * @param {boolean} [write=false] Whether it writes files to the system
 * @returns {Promise<GatewayResources|void>}
 */
async function generateTerraformConfiguration(write = false) {
	const routes = getRoutes();
	const lambaPath = getLambdaPath();
	const files = await getLambdaFiles(lambaPath);
	const nextRoutes = generateMappingsFromFiles(files);
	const finalRoutes = routes ? [...routes, nextRoutes] : nextRoutes;
	generateResources(finalRoutes);

	terraformConfiguration = {
		resource: {
			aws_api_gateway_resource: apiGatewayResource,
			aws_api_gateway_method: apiGatewayMethod,
			aws_api_gateway_integration: apiGatewayIntegration
		},
		variable: {
			integrationList: {
				default: Object.keys(apiGatewayIntegration).map(key => `aws_api_gateway_integration.${key}`)
			}
		}
	};

	if (write) {
		// eslint-disable-next-line no-console
		console.log(`Generating file ${FILE_NAMES.GATEWAY}`);
		fs.writeFileSync(
			path.join(process.cwd(), FILE_NAMES.GATEWAY),
			prettier.format(JSON.stringify(terraformConfiguration), {
				parser: "json",
				endOfLine: "lf"
			})
		);
	} else {
		return terraformConfiguration;
	}
}

module.exports = {
	generateTerraformConfiguration
};