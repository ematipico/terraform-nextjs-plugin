"use strict";
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const { BUILD_PATH, NEXT_SERVERLESS_PATH } = require("./constants");
const { generateLambdaResource } = require("./resources/terraFormLambda");
const { generateZipResource } = require("./resources/terraFormZip.js");

function generateLambda(filename) {
	const lambdaTemplate = `

const compatLayer = require('./compatLayer.js');
const page = require('./${filename}.original.js');

exports.render = (event, context, callback) => {
	const { req, res } = compatLayer(event, callback);
	page.render(req, res);
};


`;

	fs.writeFileSync(
		path.resolve(BUILD_PATH, "lambdas", filename, filename + ".js"),
		prettier.format(lambdaTemplate, {
			parser: "babel",
			endOfLine: "lf"
		}),
		{
			encoding: "utf8"
		}
	);
}

const lambdasResources = {};
const lambdasPermissions = {};
const zipResources = {};

let lambdaResources;

function generateLambdas(write = false) {
	if (fs.existsSync(BUILD_PATH + "/lambdas")) {
		fs.rmdirSync(BUILD_PATH + "/lambdas");
	}
	// it creates the folder that will contain the lambdas
	fs.mkdirSync(BUILD_PATH + "/lambdas");
	// it gets files that are inside the serverless folder created by next
	fs.readdirSync(NEXT_SERVERLESS_PATH).forEach(file => {
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
		const lambdaPath = path.resolve(BUILD_PATH, "lambdas") + "/" + lambdaName;
		fs.mkdirSync(lambdaPath);

		// 2.
		const newFilename = file.replace(".js", ".original.js");
		fs.copyFileSync(
			path.resolve(NEXT_SERVERLESS_PATH, file),
			path.resolve(BUILD_PATH, "lambdas", lambdaName, newFilename)
		);
		// 3.
		generateLambda(lambdaName);
		// 4.
		fs.copyFileSync(
			path.resolve(__dirname, "./compatLayer.js"),
			path.resolve(BUILD_PATH, "lambdas", lambdaName, "compatLayer.js")
		);

		// 5.
		const lambdaResource = generateLambdaResource({ id: lambdaName });
		lambdasResources[lambdaResource.resourceUniqueId] = lambdaResource.resource;
		lambdasPermissions[lambdaResource.permissionUniqueId] =
			lambdaResource.permission;

		// 6.
		const zipResource = generateZipResource({
			id: lambdaName,
			directoryName: lambdaName
		});
		zipResources[zipResource.uniqueId] = zipResource.resource;
	});

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
		fs.writeFileSync(
			process.cwd() + "/lambdas.terraform.json",
			prettier.format(JSON.stringify(lambdaResources), {
				parser: "json",
				endOfLine: "lf"
			})
		);
	} else {
		return lambdaResources;
	}
}

module.exports = {
	generateLambdas
};
