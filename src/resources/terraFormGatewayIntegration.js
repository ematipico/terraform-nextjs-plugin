const { getGatewayKey, getLambdaPrefix } = require("../configuration");

/**
 * It generates the integration resource
 *
 * @param {string} uniqueName
 * @param {string} gatewayResourceId
 * @param {string} lambdaName
 * @returns
 */
function generateGatewayIntegration({
	id,
	gatewayResourceId,
	lambdaName,
	params = [],
	queryStringParams = []
}) {
	return {
		uniqueId: `${getGatewayKey()}-${id}`,
		resource: _generateResource(
			gatewayResourceId,
			lambdaName,
			params,
			queryStringParams
		)
	};
}

function _generateResource(
	gatewayResourceId,
	lambdaName,
	params,
	queryStringParams
) {
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

	if (params.length > 0) {
		resource.request_parameters = params.reduce((result, param) => {
			result[`integration.request.path.${param.name}`] = `method.request.path.${
				param.name
			}`;

			return result;
		}, resource.request_parameters || {});
	}

	if (queryStringParams.length > 0) {
		resource.request_parameters = queryStringParams.reduce((result, param) => {
			result[
				`integration.request.querystring.${param.name}`
			] = `method.request.querystring.${param.name}`;

			return result;
		}, resource.request_parameters || {});
	}

	return resource;
}

module.exports = { generateGatewayIntegration };
