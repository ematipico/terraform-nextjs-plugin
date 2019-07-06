const { getGatewayKey } = require("../../../configuration");
const { getGatewayResourceId } = require("../shared");
/**
 * It generates the resource for the single method
 *
 * @param {import('../declarations').GenerateGatewayMethodPayload} options
 * @returns
 */
function generateGatewayMethod({ uniqueName, gatewayResourceId, params = [], queryStringParams = [] }) {
	return {
		uniqueId: `${getGatewayKey()}-${uniqueName}`,
		resource: _generateResource(gatewayResourceId, params, queryStringParams)
	};
}

/**
 *
 * @param {string} resourceId
 * @param {import('../declarations').Param[]} params
 * @param {import('../declarations').Param[]} queryStringParams
 */
function _generateResource(resourceId, params = [], queryStringParams = []) {
	const resource = {
		rest_api_id: getGatewayResourceId(),
		resource_id: "${aws_api_gateway_resource." + resourceId + ".id}",
		http_method: "GET",
		authorization: "NONE"
	};
	if (params.length > 0) {
		resource.request_parameters = params.reduce((result, param) => {
			result[`method.request.path.${param.name}`] = param.mandatory;

			return result;
		}, resource.request_parameters || {});
	}
	if (queryStringParams.length > 0) {
		resource.request_parameters = queryStringParams.reduce((result, param) => {
			result[`method.request.querystring.${param.name}`] = param.mandatory;

			return result;
		}, resource.request_parameters || {});
	}
	return resource;
}

module.exports = { generateGatewayMethod };
