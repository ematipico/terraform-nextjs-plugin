const AwsConfig = require("../../../src/providers/aws/awsConfig");
const GatewayIntegration = require("../../../src/providers/aws/resources/gatewayIntegration");

describe("Gateway integration", () => {
	it("should return the expected resource", () => {
		const config = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS",
		});

		const resource = new GatewayIntegration(config, {
			id: "index",
			lambdaName: "index",
			pathname: "/",
		});

		const result = resource.generateGatewayIntegration("CustomKey-index");

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.CustomKey-index.id}",
			http_method: "GET",
			integration_http_method: "POST",
			type: "AWS_PROXY",
			uri:
				"arn:aws:apigateway:${local.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.lambdaForCustomKey-index.arn}/invocations",
		});
	});
});
