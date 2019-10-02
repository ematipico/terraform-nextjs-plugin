const { getGatewayKey } = require("../../../configuration");
const { getGatewayResourceId } = require("../shared");
/**
 * It generates the resource for the single method
 *
 * @param {import('../declarations').GenerateGatewayMethodPayload} options
 * @returns
 */
function generateGatewayMethod({ uniqueName, gatewayResourceId, params: parameters = [], queryStringParams: queryStringParameters = [] }) {
	return {
		uniqueId: `${getGatewayKey()}-${uniqueName}`,
		resource: _generateResource(gatewayResourceId, parameters, queryStringParameters)
	};
}

/**
 *
 * @param {string} resourceId
 * @param {import('../declarations').Param[]} parameters
 * @param {import('../declarations').Param[]} queryStringParameters
 */
function _generateResource(resourceId, parameters = [], queryStringParameters = []) {
	const resource = {
		rest_api_id: getGatewayResourceId(),
		resource_id: "${aws_api_gateway_resource." + resourceId + ".id}",
		http_method: "GET",
		authorization: "NONE"
	};
	if (parameters.length > 0) {
		resource.request_parameters = parameters.reduce((result, parameter) => {
			result[`method.request.path.${parameter.name}`] = parameter.mandatory;

			return result;
		}, resource.request_parameters || {});
	}
	if (queryStringParameters.length > 0) {
		resource.request_parameters = queryStringParameters.reduce((result, parameter) => {
			result[`method.request.querystring.${parameter.name}`] = parameter.mandatory;

			return result;
		}, resource.request_parameters || {});
	}
	return resource;
}

module.exports = { generateGatewayMethod };
