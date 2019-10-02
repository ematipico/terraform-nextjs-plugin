const { getGatewayKey } = require("../../../configuration");
const { getLambdaPrefix } = require("../shared");

/**
 * It generates the Lambda resource
 *
 * @param {object} options
 * @param {string} options.id
 * @returns {import('../declarations').GenerateLambdaResource}
 */
function generateLambdaResource({ id }) {
	const cleanedId = id.replace(/[|]/, "");
	const lambdaId = `${getLambdaPrefix()}-${cleanedId}`;
	return {
		resourceUniqueId: lambdaId,
		resource: {
			filename: "${data.archive_file.packLambda-" + cleanedId + ".output_path}",
			function_name: "${local.groupname}-" + cleanedId,
			source_code_hash: "${data.archive_file.packLambda-" + cleanedId + ".output_base64sha256}",
			handler: id + ".render",
			runtime: "nodejs8.10",
			memory_size: "1024",
			timeout: "180",
			role: "${local.lambda_iam_role}"
		},
		permissionUniqueId: lambdaId,
		permission: {
			statement_id: "AllowExecutionFromAPIGateway",
			action: "lambda:InvokeFunction",
			function_name: "${aws_lambda_function." + lambdaId + ".function_name}",
			principal: "apigateway.amazonaws.com",
			source_arn: "${aws_api_gateway_rest_api." + getGatewayKey() + ".execution_arn}/*/*/*"
		}
	};
}

module.exports = { generateLambdaResource };
