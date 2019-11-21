/** @typedef {import('../declarations').AwsGatewayOptions} AwsGatewayOptions */
/**
 * @typedef {import('../awsConfig')} AwsConfig
 */
class GatewayMethod {
	/**
	 *
	 * @param {AwsConfig} config
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
	 *
	 * @param {string} resourceId
	 */
	generateResource(resourceId) {
		const resource = {
			rest_api_id: this.config.getGatewayResourceId(),
			resource_id: "${aws_api_gateway_resource." + resourceId + ".id}",
			http_method: "GET",
			authorization: "NONE"
		};
		if (this.options.params && this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`method.request.path.${parameter.name}`] = parameter.mandatory;

				return result;
			}, resource.request_parameters || {});
		}
		if (this.options.queryStringParams && this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[`method.request.querystring.${parameter.name}`] = parameter.mandatory;

				return result;
			}, resource.request_parameters || {});
		}
		return resource;
	}
}

module.exports = GatewayMethod;
