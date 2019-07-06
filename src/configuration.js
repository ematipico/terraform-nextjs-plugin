const MissingKeyError = require("./errors/missingKeyError");
const ProviderNotSupported = require("./errors/providerNotSupported");
const IncorrectRoutesError = require("./errors/incorretRoutesError");
const EmptyConfigurationError = require("./errors/emptyConfigurationError");
const { PROVIDERS, NEXT_CONFIG } = require("./constants");
const path = require("path");
const fs = require("fs");

/**
 * @typedef {import('./errors/errors').ValidationError} ValidationError
 * @typedef {import('./declarations').terranext.Route} Route
 * @typedef {import('./declarations').terranext.Configuration} Configuration
 */

/**
 * @type {Configuration}
 */
let configuration;

/**
 *
 *
 * @param {Configuration} config
 */
function setConfiguration(config) {
	const { gatewayKey, nextAppDir, routes, provider, buildPath } = config;
	configuration = Object.assign(
		{},
		{
			gatewayKey: gatewayKey || "Terranext",
			buildPath: buildPath || ".next",
			provider,
			lambdaPath: nextAppDir ? path.resolve(process.cwd(), nextAppDir) : "./",
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
 * @param {Configuration} config
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
	const { gatewayKey, nextAppDir: lambdaPath, routes, provider } = config;

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

/**
 * @returns {string}
 */
function getLambdaPath() {
	return configuration.nextAppDir + "/" + configuration.buildPath + "/serverless/pages";
}

/**
 * @returns {string}
 */
function getGatewayKey() {
	return configuration.gatewayKey;
}

/**
 *
 * @returns {Route[]|undefined}
 */
function getRoutes() {
	if (Array.isArray(configuration.routes)) {
		return configuration.routes;
	}
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

function getNextConfig() {
	const nextFolder = getBuildPath();
	const nextConfigFile = path.resolve(nextFolder, NEXT_CONFIG);
	if (fs.existsSync(nextConfigFile)) {
		return nextConfigFile;
	}
	throw new Error("Missing config file inside the Next.js folder");
}

module.exports = {
	setConfiguration,
	getConfiguration,
	checkConfiguration,
	getRoutes,
	getGatewayKey,
	getLambdaPath,
	getNextConfig,
	getBuildPath,
	getServerlessBuildPath
};
