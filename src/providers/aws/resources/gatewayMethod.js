/** @typedef {import('../declarations').AwsGatewayOptions} AwsGatewayOptions */

class GatewayMethod {
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
	 * It generates the resource for the single method
	 *
	 * @returns
	 */
	generateGatewayMethod(gatewayResourceId) {
		return {
			uniqueId: `${this.config.getGatewayKey()}-${this.options.id}`,
			resource: this.generateResource(gatewayResourceId)
		};
	}

	/**
	 * @returns {string}
	 */
	getGatewayResourceId() {
		return "${aws_api_gateway_rest_api." + this.config.etGatewayKey() + ".id}";
	}

	/**
	 *
	 * @param {string} resourceId
	 */
	generateResource(resourceId) {
		const resource = {
			rest_api_id: this.getGatewayResourceId(),
			resource_id: "${aws_api_gateway_resource." + resourceId + ".id}",
			http_method: "GET",
			authorization: "NONE"
		};
		if (this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`method.request.path.${parameter.name}`] = parameter.mandatory;

				return result;
			}, resource.request_parameters || {});
		}
		if (this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[`method.request.querystring.${parameter.name}`] = parameter.mandatory;

				return result;
			}, resource.request_parameters || {});
		}
		return resource;
	}
}

module.exports = GatewayMethod;
