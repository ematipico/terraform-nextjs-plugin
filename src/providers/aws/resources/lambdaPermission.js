class LambdaPermission {
	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	/**
	 * @returns {string}
	 */
	getLambdaPrefix() {
		return `lambdaFor${this.config.getGatewayKey()}`;
	}

	/**
	 * It generates the Lambda resource
	 *
	 * @returns {import('../declarations').LambdaPermission}
	 */
	generateLambdaPermissions() {
		const cleanedId = this.options.id.replace(/\[|\]/g, "");
		const lambdaId = `${this.getLambdaPrefix()}-${cleanedId}`;
		return {
			permissionUniqueId: this.getLambdaPrefix(),
			resource: {
				statement_id: "AllowExecutionFromAPIGateway",
				action: "lambda:InvokeFunction",
				function_name: "${aws_lambda_function." + lambdaId + ".function_name}",
				principal: "apigateway.amazonaws.com",
				source_arn: "${aws_api_gateway_rest_api." + this.config.getGatewayKey() + ".execution_arn}/*/*/*"
			}
		};
	}
}

module.exports = LambdaPermission;
