// @ts-nocheck
const { generateLambdaResource } = require("../src/providers/aws/resources/terraFormLambda");
const { setConfiguration } = require("../src/configuration");

describe("terraFormLambda", () => {
	it("should create the correct resource", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const result = generateLambdaResource({ id: "index" });
		expect(result.resourceUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.permissionUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.resource).toStrictEqual({
			filename: "${data.archive_file.packLambda-index.output_path}",
			function_name: "${local.groupname}-index",
			source_code_hash: "${data.archive_file.packLambda-index.output_base64sha256}",
			handler: "index.render",
			runtime: "nodejs8.10",
			memory_size: "1024",
			timeout: "180",
			role: "${local.lambda_iam_role}"
		});

		expect(result.permission).toStrictEqual({
			statement_id: "AllowExecutionFromAPIGateway",
			action: "lambda:InvokeFunction",
			function_name: "${aws_lambda_function.lambdaForCustomKey-index.function_name}",
			principal: "apigateway.amazonaws.com",
			source_arn: "${aws_api_gateway_rest_api.CustomKey.execution_arn}/*/*/*"
		});
	});
});
