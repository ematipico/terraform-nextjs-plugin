const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const { generateLambdaResource } = require("./resources/terraFormLambda");
const { generateZipResource } = require("./resources/terraFormZip.js");
const { getBuildPath, getServerlessBuildPath } = require("../../configuration");
const { COMPAT_LAYER_PATH, FILE_NAMES } = require("../../constants");
const { getLambdaFiles } = require("./shared");
const FolderNotFoundError = require("../../errors/folderNotFoundError");

function generateLambda(filename, thePath) {
	const lambdaTemplate = `

const compatLayer = require('./compatLayer.js');
const page = require('./${filename}.original.js');

exports.render = (event, context, callback) => {
	const { req, res } = compatLayer(event, callback);
	page.render(req, res);
};


`;

	fs.writeFileSync(
		path.resolve(thePath, "lambdas", filename, filename + ".js"),
		prettier.format(lambdaTemplate, {
			parser: "babel",
			endOfLine: "lf"
		}),
		{
			encoding: "utf8"
		}
	);
}

/** @typedef {import('./aws').AWS.LambdaFunction} Lambdas */
/** @typedef {import('./aws').AWS.LambdaPermission} LambdaPermissions */
/** @typedef {import('./aws').AWS.LambdaData} LambdaData */
/** @typedef {import('./aws').AWS.LambdaResources} LambdaResources */
/** @type {Lambdas} */
const lambdasResources = {};
/** @type {LambdaPermissions} */
const lambdasPermissions = {};
/**@type {LambdaData} */
const zipResources = {};

/** @type {LambdaResources} */
let lambdaResources;

/**
 *
 *
 * @param {boolean} [write=false]
 * @returns {Promise<LambdaResources>}
 */
function generateLambdas(write = false) {
	const buildPath = getBuildPath();
	const serverlessBuildPath = getServerlessBuildPath();

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
				 * 4. copy the compatLayer file
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
				// 3.
				generateLambda(lambdaName, buildPath);
				// 4.
				fs.copyFileSync(
					path.resolve(COMPAT_LAYER_PATH, "./compatLayer.js"),
					path.resolve(buildPath, "lambdas", lambdaName, "compatLayer.js")
				);

				// 5.
				const lambdaResource = generateLambdaResource({ id: lambdaName });
				lambdasResources[lambdaResource.resourceUniqueId] = lambdaResource.resource;
				lambdasPermissions[lambdaResource.permissionUniqueId] = lambdaResource.permission;

				// 6.
				const zipResource = generateZipResource({
					id: lambdaName,
					directoryName: lambdaName
				});
				zipResources[zipResource.uniqueId] = zipResource.resource;
			});
			// it gets files that are inside the serverless folder created by next
			fs.readdirSync(serverlessBuildPath);

			lambdaResources = {
				resource: {
					aws_lambda_function: lambdasResources,
					aws_lambda_permission: lambdasPermissions
				},
				data: {
					archive_file: zipResources
				}
			};

			if (write === true) {
				// eslint-disable-next-line no-console
				console.log(`Generating file ${FILE_NAMES.LAMBDAS}`);
				fs.writeFileSync(
					path.join(process.cwd(), FILE_NAMES.LAMBDAS),
					prettier.format(JSON.stringify(lambdaResources), {
						parser: "json",
						endOfLine: "lf"
					})
				);
			} else {
				return lambdaResources;
			}
		})
		.catch(() => {
			throw new FolderNotFoundError(serverlessBuildPath);
		});
}

module.exports = {
	generateLambdas
};
