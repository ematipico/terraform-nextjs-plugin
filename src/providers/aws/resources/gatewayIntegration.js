/** @typedef {import('../aws.declarations').AWS.GatewayIntegration} GatewayIntegrationObject */
/** @typedef {import('../declarations').Param} Param */
/** @typedef {import('../declarations').AwsGatewayOptions} AwsGatewayOptions */
/**
 * @typedef {import('../awsConfig')} AwsConfig
 */

class GatewayIntegration {
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
	 * It generates the integration resource
	 *
	 * @param {string} gatewayResourceId
	 * @returns {{ uniqueId: string, resource: GatewayIntegrationObject }}
	 */
	generateGatewayIntegration(gatewayResourceId) {
		return {
			uniqueId: `${this.config.getGatewayKey()}-${this.options.id}`,
			resource: this.generateResource(gatewayResourceId),
		};
	}

	/**
	 *
	 *
	 * @param {string} gatewayResourceId
	 * @returns {GatewayIntegrationObject}
	 */
	generateResource(gatewayResourceId) {
		const resource = {
			rest_api_id: "${aws_api_gateway_rest_api." + this.config.getGatewayKey() + ".id}",
			resource_id: "${aws_api_gateway_resource." + gatewayResourceId + ".id}",
			http_method: "GET",
			integration_http_method: "POST",
			type: "AWS_PROXY",
			uri:
				"arn:aws:apigateway:${local.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function." +
				this.config.getLambdaPrefix() +
				"-" +
				this.options.lambdaName +
				".arn}/invocations",
		};

		if (this.options.params && this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`integration.request.path.${parameter.name}`] = `method.request.path.${parameter.name}`;

				return result;
			}, resource.request_parameters || {});
		}

		if (this.options.queryStringParams && this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[`integration.request.querystring.${parameter.name}`] = `method.request.querystring.${parameter.name}`;

				return result;
			}, resource.request_parameters || {});
		}

		return resource;
	}
}

module.exports = GatewayIntegration;
