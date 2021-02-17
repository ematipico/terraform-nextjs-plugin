import Configuration from "../../configuration";

export default class AwsConfig extends Configuration {
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

