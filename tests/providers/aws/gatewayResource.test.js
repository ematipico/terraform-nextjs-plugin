const GatewayResource = require("../../../src/providers/aws/resources/gatewayResource");
const AwsConfig = require("../../../src/providers/aws/awsConfig");

describe("Gateway integration", () => {
	it("should return the expected resource for a top level", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS"
		});

		const method = new GatewayResource(c, {
			id: "myId",
			pathname: "personal-page",
			lambdaName: "myId"
		});

		const result = method.generateGatewayResource();

		expect(result.uniqueId).toBe("CustomKey-myId");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			parent_id: "${aws_api_gateway_rest_api.CustomKey.root_resource_id}",
			path_part: "personal-page"
		});
	});

	it("should return the expected resource when it has a parent", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS"
		});

		const method = new GatewayResource(c, {
			id: "mySecondId",
			pathname: "personal-page",
			parentId: "myId",
			lambdaName: "mySecondId"
		});

		const result = method.generateGatewayResource();

		expect(result.uniqueId).toBe("CustomKey-mySecondId");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			parent_id: "${aws_api_gateway_resource.CustomKey-myId.id}",
			path_part: "personal-page"
		});
	});
});
