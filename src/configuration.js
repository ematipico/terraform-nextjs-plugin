const { MissingKeyError } = require("./errors/missingKeyError");
const { IncorrectRoutesError } = require("./errors/incorretRoutesError");
let configuration;

/**
 *
 *
 * @param {*} newConfiguration
 * @param {string} newConfiguration.prefix
 */
function setConfiguration({ gatewayKey, lambdaPath, routes }) {
	configuration = Object.assign(
		{},
		{
			gatewayKey: gatewayKey || "Terranext",
			lambdaPath,
			routes
		}
	);
}

function getConfiguration() {
	return configuration;
}

function checkConfiguration(config) {
	if (!config) throw new Error("Empty configuration, cannot proceed.");
	const { gatewayKey, lambdaPath, routes } = config;

	if (!gatewayKey) throw new MissingKeyError("gatewayKey");
	if (!lambdaPath) throw new MissingKeyError("lambdaPath");
	if (!routes) throw new MissingKeyError("routes");

	if (Array.isArray(routes)) {
		const isInvalid = routes.some(r => checkRoutes(r) === false);
		if (isInvalid === true) throw new IncorrectRoutesError();
	} else {
		if (!checkRoutes(routes)) throw new IncorrectRoutesError();
	}

	return true;
}

function checkRoutes(routes) {
	let valid = true;

	if (
		typeof routes.prefix === "undefined" ||
		typeof routes.mappings === "undefined"
	)
		return false;

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
	return configuration.lambdaPath;
}

function getGatewayKey() {
	return configuration.gatewayKey;
}

function getRoutes() {
	return configuration.routes;
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
	getLambdaPath
};
