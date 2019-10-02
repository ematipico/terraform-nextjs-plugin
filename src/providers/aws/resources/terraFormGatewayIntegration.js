const { getGatewayKey } = require("../../../configuration");
const { getLambdaPrefix } = require("../shared");

/** @typedef {import('../aws').AWS.GatewayIntegration} GatewayIntegration */
/** @typedef {import('../declarations').Param} Param */

/** @typedef {{ uniqueId: string; resource: GatewayIntegration }} ReturnResult */
/**
 * It generates the integration resource
 *
 * @param {import('../declarations').GenerateGatewayIntegrationPayload} options
 * @returns {ReturnResult}
 */
function generateGatewayIntegration({
	id,
	gatewayResourceId,
	lambdaName,
	params: parameters = [],
	queryStringParams: queryStringParameters = []
}) {
	return {
		uniqueId: `${getGatewayKey()}-${id}`,
		resource: _generateResource(gatewayResourceId, lambdaName, parameters, queryStringParameters)
	};
}

/**
 *
 *
 * @param {string} gatewayResourceId
 * @param {string} lambdaName
 * @param {Param[]} params
 * @param {Param[]} queryStringParams
 * @returns {GatewayIntegration}
 */
function _generateResource(gatewayResourceId, lambdaName, parameters, queryStringParameters) {
	const resource = {
		rest_api_id: "${aws_api_gateway_rest_api." + getGatewayKey() + ".id}",
		resource_id: "${aws_api_gateway_resource." + gatewayResourceId + ".id}",
		http_method: "GET",
		integration_http_method: "POST",
		type: "AWS_PROXY",
		uri:
			"arn:aws:apigateway:${local.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function." +
			getLambdaPrefix() +
			"-" +
			lambdaName +
			".arn}/invocations"
	};

	if (parameters.length > 0) {
		resource.request_parameters = parameters.reduce((result, parameter) => {
			result[`integration.request.path.${parameter.name}`] = `method.request.path.${parameter.name}`;

			return result;
		}, resource.request_parameters || {});
	}

	if (queryStringParameters.length > 0) {
		resource.request_parameters = queryStringParameters.reduce((result, parameter) => {
			result[`integration.request.querystring.${parameter.name}`] = `method.request.querystring.${parameter.name}`;

			return result;
		}, resource.request_parameters || {});
	}

	return resource;
}

module.exports = { generateGatewayIntegration };
