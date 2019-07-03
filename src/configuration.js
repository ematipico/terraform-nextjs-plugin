const MissingKeyError = require("./errors/missingKeyError");
const ProviderNotSupported = require("./errors/providerNotSupported");
const IncorrectRoutesError = require("./errors/incorretRoutesError");
const EmptyConfigurationError = require("./errors/emptyConfigurationError");
const { PROVIDERS } = require("./constants");
const path = require("path");

/**
 * @typedef {import('./errors/errors').ValidationError} ValidationError
 * @typedef {import('./declarations').terranext.Route} Route
 */

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
 * @returns {Boolean|ValidationError[]}
 */
function checkConfiguration(config) {
	/**
	 * @type {ValidationError[]}
	 */

	let errors = [];
	if (!config) {
		errors.push(new EmptyConfigurationError());
		return errors;
	}
	const { gatewayKey, lambdaPath, routes, provider } = config;

	if (!gatewayKey) errors.push(new MissingKeyError("gatewayKey"));
	if (!lambdaPath) errors.push(new MissingKeyError("lambdaPath"));

	if (routes) {
		if (Array.isArray(routes)) {
			const isInvalid = routes.some(r => checkRoutes(r) === false);
			if (isInvalid === true) errors.push(new IncorrectRoutesError());
		} else {
			if (!checkRoutes(routes)) errors.push(new IncorrectRoutesError());
		}
	}

	if (!provider) errors.push(new MissingKeyError("provider"));

	if (!Object.keys(PROVIDERS).includes(provider)) {
		errors.push(new ProviderNotSupported(provider));
	}

	if (errors.length > 0) return errors;

	return true;
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

/**
 *
 *
 * @returns {Route[]|undefined}
 */
function getRoutes() {
	return [configuration.routes];
}

/**
 * @returns {string}
 */
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
