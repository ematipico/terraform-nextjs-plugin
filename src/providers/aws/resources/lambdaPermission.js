/**
 * @typedef {import('../awsConfig')} AwsConfig
 */
/**
 * @typedef {import('../declarations').LambdaOptions} LambdaOptions
 */

class LambdaPermission {
	/**
	 *
	 * @param {AwsConfig} config
	 * @param {LambdaOptions} options
	 */
	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the Lambda resource
	 *
	 * @returns {import('../declarations').LambdaPermission}
	 */
	generateLambdaPermissions() {
		const cleanedId = this.options.id.replace(/\[|]/g, "");
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		return {
			permissionUniqueId: lambdaId,
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
