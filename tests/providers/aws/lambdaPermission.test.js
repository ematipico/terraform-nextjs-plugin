const LambdaPermission = require("../../../src/providers/aws/resources/lambdaPermission");
const AwsConfig = require("../../../src/providers/aws/awsConfig");

describe("terraFormLambda", () => {
	it("should create the correct resource", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS"
		});

		const properties = new LambdaPermission(c, {
			id: "index",
			directoryName: "/test"
		});

		const result = properties.generateLambdaPermissions();

		expect(result.permissionUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.resource).toStrictEqual({
			statement_id: "AllowExecutionFromAPIGateway",
			action: "lambda:InvokeFunction",
			function_name: "${aws_lambda_function.lambdaForCustomKey-index.function_name}",
			principal: "apigateway.amazonaws.com",
			source_arn: "${aws_api_gateway_rest_api.CustomKey.execution_arn}/*/*/*"
		});
	});
});
