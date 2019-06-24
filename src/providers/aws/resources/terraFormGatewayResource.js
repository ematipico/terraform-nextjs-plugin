const { getGatewayResourceId, getRootResource, getGatewayKey } = require("../../../configuration");

/**
 * It generates the ApiGateway resource
 *
 * @param {import('../declarations').GenerateGatewayResourcePayload} options
 * @returns
 */
function generateGatewayResource({ id, pathname, parentId, isUrlParam }) {
	return {
		uniqueId: generateUniqueId(id),
		resource: _generateResource(pathname, parentId, isUrlParam)
	};
}

/**
 *
 * @param {string} id
 * @returns string
 */
function generateUniqueId(id) {
	return `${getGatewayKey()}-${id}`;
}

/**
 * It generates the single resource
 * @param {string} pathname
 * @param {string?} parentId
 * @param {boolean?} isUrlParam
 * @returns {import('../aws').AWS.GatewayResource}
 */
function _generateResource(pathname, parentId, isUrlParam) {
	return {
		rest_api_id: getGatewayResourceId(),
		parent_id: parentId ? "${aws_api_gateway_resource." + parentId + ".id}" : getRootResource(),
		path_part: isUrlParam ? `{${pathname}}` : pathname
	};
}

module.exports = {
	generateGatewayResource,
	generateUniqueId
};
