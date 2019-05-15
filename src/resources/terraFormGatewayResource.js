const {
	getGatewayResourceId,
	getRootResource,
	getGatewayKey
} = require("../configuration");

/**
 * It generates the ApiGateway resource
 *
 * @param {string} id
 * @param {string} pathname
 * @param {string?} parentId
 * @param {boolean?} isUrlParam
 * @returns
 */
function generateGatewayResource({ id, pathname, parentId, isUrlParam }) {
	return {
		uniqueId: generateUniqueId(id),
		resource: _generateResource(pathname, parentId, isUrlParam)
	};
}

function generateUniqueId(id) {
	return `${getGatewayKey()}-${id}`;
}

function _generateResource(pathname, parentId, isUrlParam) {
	return {
		rest_api_id: getGatewayResourceId(),
		parent_id: parentId
			? "${aws_api_gateway_resource." + parentId + ".id}"
			: getRootResource(),
		path_part: isUrlParam ? `{${pathname}}` : pathname
	};
}

module.exports = {
	generateGatewayResource,
	generateUniqueId
};
