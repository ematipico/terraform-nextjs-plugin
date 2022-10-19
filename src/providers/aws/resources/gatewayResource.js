/** @typedef {import('../declarations').AwsGatewayOptions} AwsGatewayOptions */
/**
 * @typedef {import('../awsConfig')} AwsConfig
 */
class GatewayResource {
	/**
	 *
	 * @param {AwsConfig} config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config, options) {
		this.config = config;
		this.options = options;
		this.parentResourceName = this.createUniqueId(this.options.parentId);
	}

	/**
	 * It generates the ApiGateway resource
	 * @returns
	 */
	generateGatewayResource() {
		return {
			uniqueId: this.generateUniqueId(),
			resource: this.generateResource(),
		};
	}

	/**
	 *
	 * @returns string
	 */
	generateUniqueId() {
		return `${this.config.getGatewayKey()}-${this.options.id}`;
	}

	/**
	 *
	 * @returns string
	 */
	createUniqueId(id) {
		if (!id) {
			return;
		}
		return `${this.config.getGatewayKey()}-${id}`;
	}

	/**
	 * It generates the single resource
	 */
	generateResource() {
		return {
			rest_api_id: this.config.getGatewayResourceId(),
			parent_id: this.options.parentId ? `\${aws_api_gateway_resource.${this.parentResourceName}.id}` : this.config.getRootResource(),
			path_part: this.options.isUrlParameter ? `{${this.options.pathname}}` : this.options.pathname,
		};
	}
}

module.exports = GatewayResource;
