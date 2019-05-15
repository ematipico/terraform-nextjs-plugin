const {
	generateGatewayResource
} = require("../src/resources/terraFormGatewayResource");

const { setConfiguration } = require("../src/configuration");

describe("Gateway integration", () => {
	it("should return the expected resource for a top level", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const res = generateGatewayResource({
			id: "myId",
			pathname: "personal-page"
		});

		expect(res.uniqueId).toBe("CustomKey-myId");
		expect(res.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			parent_id: "${aws_api_gateway_rest_api.CustomKey.root_resource_id}",
			path_part: "personal-page"
		});
	});

	it("should return the expected resource when it has a parent", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const res = generateGatewayResource({
			id: "mySecondId",
			pathname: "personal-page",
			parentId: "CustomKey-myId"
		});

		expect(res.uniqueId).toBe("CustomKey-mySecondId");
		expect(res.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			parent_id: "${aws_api_gateway_resource.CustomKey-myId.id}",
			path_part: "personal-page"
		});
	});
});
