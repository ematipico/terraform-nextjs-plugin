/** @typedef {import('../declarations').AwsGatewayOptions} AwsGatewayOptions */

class GatewayResource {
	/**
	 *
	 * @param config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the ApiGateway resource
	 * @returns
	 */
	generateGatewayResource() {
		return {
			uniqueId: this.generateUniqueId(this.options.id),
			resource: this.generateResource()
		};
	}

	/**
	 *
	 * @param {string} id
	 * @returns string
	 */
	generateUniqueId(id) {
		return `${this.config.getGatewayKey()}-${id}`;
	}

	/**
	 * @returns {string}
	 */
	getGatewayResourceId() {
		return "${aws_api_gateway_rest_api." + this.config.etGatewayKey() + ".id}";
	}

	/**
	 * @returns {string}
	 */
	getRootResource() {
		return "${aws_api_gateway_rest_api." + this.config.getGatewayKey() + ".root_resource_id}";
	}

	/**
	 * It generates the single resource
	 */
	generateResource() {
		return {
			rest_api_id: this.getGatewayResourceId(),
			parent_id: this.options.parentId ? "${aws_api_gateway_resource." + this.options.parentId + ".id}" : this.getRootResource(),
			path_part: this.options.isUrlParameter ? `{${this.options.pathname}}` : this.options.pathname
		};
	}
}

module.exports = GatewayResource;
