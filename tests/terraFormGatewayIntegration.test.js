// @ts-nocheck
const { generateGatewayIntegration } = require("../src/providers/aws/resources/terraFormGatewayIntegration");

const { setConfiguration } = require("../src/configuration");

describe("Gateway integration", () => {
	it("should return the expected resource", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const resource = generateGatewayIntegration({
			id: "index",
			gatewayResourceId: "CustomKey-index",
			lambdaName: "index"
		});

		expect(resource.uniqueId).toBe("CustomKey-index");
		expect(resource.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.CustomKey-index.id}",
			http_method: "GET",
			integration_http_method: "POST",
			type: "AWS_PROXY",
			uri:
				"arn:aws:apigateway:${local.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.lambdaForCustomKey-index.arn}/invocations"
		});
	});
});
