const { getLambdaPrefix, getGatewayKey } = require("../configuration");

/**
 * It generates the Lambda resource
 *
 * @param {string} id
 * @returns
 */
function generateLambdaResource({ id }) {
	const lamdbaId = `${getLambdaPrefix()}-${id}`;
	return {
		resourceUniqueId: lamdbaId,
		resource: {
			filename: "${data.archive_file.packLambda-" + id + ".output_path}",
			function_name: "${local.groupname}-" + id,
			source_code_hash: "${data.archive_file.packLambda-" + id + ".output_base64sha256}",
			handler: id + ".render",
			runtime: "nodejs8.10",
			memory_size: "1024",
			timeout: "180",
			role: "${local.lambda_iam_role}"
		},
		permissionUniqueId: lamdbaId,
		permission: {
			statement_id: "AllowExecutionFromAPIGateway",
			action: "lambda:InvokeFunction",
			function_name: "${aws_lambda_function." + lamdbaId + ".function_name}",
			principal: "apigateway.amazonaws.com",
			source_arn: "${aws_api_gateway_rest_api." + getGatewayKey() + ".execution_arn}/*/*/*"
		}
	};
}

module.exports = { generateLambdaResource };
