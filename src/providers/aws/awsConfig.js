const Configuration = require("../../configuration");

/**
 * @typedef {import('../../index').Configuration} GlobalConfiguration
 */
class AwsConfig extends Configuration {
	/**
	 *
	 * @param {GlobalConfiguration} configuration
	 */
	constructor(configuration) {
		super(configuration);
	}

	/**
	 * @returns {string}
	 */
	getLambdaPrefix() {
		return `lambdaFor${this.getGatewayKey()}`;
	}

	/**
	 * @returns {string}
	 */
	getGatewayResourceId() {
		return "${aws_api_gateway_rest_api." + this.getGatewayKey() + ".id}";
	}

	/**
	 * @returns {string}
	 */
	getRootResource() {
		return "${aws_api_gateway_rest_api." + this.getGatewayKey() + ".root_resource_id}";
	}
}

module.exports = AwsConfig;
