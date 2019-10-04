const fs = require("fs");
const path = require("path");
const { generateLambdaResource } = require("./resources/terraFormLambda");
const { generateZipResource } = require("./resources/terraFormZip.js");
const { getBuildPath, getServerlessBuildPath } = require("../../configuration");
const { FILE_NAMES } = require("../../constants");
const { getLambdaFiles } = require("../../shared");
const FolderNotFoundError = require("../../errors/folderNotFoundError");

function generateLambda(filename, thePath) {
	const lambdaTemplate = `

const page = require('./${filename}.original.js');
const http = require('http')

exports.render = (event, context, callback) => {
	const server = new http.Server((req, res) => page.render(req, res));
	server.listen(3000);
};


`;

	fs.writeFileSync(path.resolve(thePath, "lambdas", filename, filename + ".js"), JSON.stringify(lambdaTemplate, null, 4), {
		encoding: "utf-8"
	});
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
				 * 4. generate the lambda resource
				 * 5. generate the zip file resource
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
				const lambdaResource = generateLambdaResource({ id: lambdaName });
				lambdasResources[lambdaResource.resourceUniqueId] = lambdaResource.resource;
				lambdasPermissions[lambdaResource.permissionUniqueId] = lambdaResource.permission;

				// 5.
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

module.exports = {
	generateLambdas
};
