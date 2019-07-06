const { getGatewayKey } = require("../../configuration");
/**
 * @returns {string}
 */
function getGatewayResourceId() {
	return "${aws_api_gateway_rest_api." + getGatewayKey() + ".id}";
}

/**
 * @returns {string}
 */
function getRootResource() {
	return "${aws_api_gateway_rest_api." + getGatewayKey() + ".root_resource_id}";
}

/**
 * @returns {string}
 */
function getLambdaPrefix() {
	return `lambdaFor${getGatewayKey()}`;
}

module.exports = {
	getGatewayResourceId,
	getRootResource,
	getLambdaPrefix
};
