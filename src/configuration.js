const { MissingKeyError } = require("./errors/missingKeyError");
const { ProviderNotSupported } = require("./errors/providerNotSupported");
const { IncorrectRoutesError } = require("./errors/incorretRoutesError");
const { PROVIDERS } = require("./constants");
const path = require("path");

let configuration;

/**
 *
 *
 * @param {import('./declarations').terranext.Configuration} configuration
 */
function setConfiguration({ gatewayKey, lambdaPath, routes }) {
	configuration = Object.assign(
		{},
		{
			gatewayKey: gatewayKey || "Terranext",
			buildPath: ".next",
			lambdaPath,
			routes
		}
	);
}

function getConfiguration() {
	return configuration;
}

/**
 *
 *
 * @param {import('./declarations').terranext.Configuration} config
 */
function checkConfiguration(config) {
	if (!config) throw new Error("Empty configuration, cannot proceed.");
	const { gatewayKey, lambdaPath, routes, provider } = config;

	if (!gatewayKey) throw new MissingKeyError("gatewayKey");
	if (!lambdaPath) throw new MissingKeyError("lambdaPath");
	if (!routes) throw new MissingKeyError("routes");

	if (Array.isArray(routes)) {
		const isInvalid = routes.some(r => checkRoutes(r) === false);
		if (isInvalid === true) throw new IncorrectRoutesError();
	} else {
		if (!checkRoutes(routes)) throw new IncorrectRoutesError();
	}

	checkProvider(provider);

	return true;
}

function checkProvider(provider) {
	if (!provider) throw new MissingKeyError("provider");

	if (!Object.keys(PROVIDERS).includes(provider)) {
		throw new ProviderNotSupported(provider);
	}
}

function checkRoutes(routes) {
	let valid = true;

	if (typeof routes.prefix === "undefined" || typeof routes.mappings === "undefined") return false;

	if (typeof routes.prefix !== "string") return false;

	valid = routes.mappings.every(mapping => {
		return !!mapping.route && !!mapping.page;
	});

	return valid;
}

function getGatewayResourceId() {
	return "${aws_api_gateway_rest_api." + getGatewayKey() + ".id}";
}

function getRootResource() {
	return "${aws_api_gateway_rest_api." + getGatewayKey() + ".root_resource_id}";
}

function getLambdaPrefix() {
	return `lambdaFor${getGatewayKey()}`;
}

function getLambdaPath() {
	return configuration.lambdaPath + "/" + configuration.buildPath + "/serverless/pages";
}

function getGatewayKey() {
	return configuration.gatewayKey;
}

function getRoutes() {
	return configuration.routes;
}

function getBuildPath() {
	return path.resolve(process.cwd(), configuration.buildPath);
}

function getServerlessBuildPath() {
	return path.resolve(process.cwd(), configuration.buildPath, "serverless/pages");
}

module.exports = {
	setConfiguration,
	getConfiguration,
	checkConfiguration,
	getGatewayResourceId,
	getRoutes,
	getGatewayKey,
	getLambdaPrefix,
	getRootResource,
	getLambdaPath,
	getBuildPath,
	getServerlessBuildPath
};
