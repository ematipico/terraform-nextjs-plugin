const { setConfiguration } = require("../src/configuration");
const {
	generateGatewayMethod
} = require("../src/resources/terraFormGatewayMethod");
describe("terraFormGatewayMethod", () => {
	it("should create a correct resource", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const result = generateGatewayMethod({
			uniqueName: "index",
			gatewayResourceId: "index"
		});

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE"
		});
	});

	it("should create a correct resource when there are normal params", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const result = generateGatewayMethod({
			uniqueName: "index",
			gatewayResourceId: "index",
			params: [
				{
					name: "accountId",
					mandatory: true
				},
				{
					name: "socialId",
					mandatory: true
				}
			]
		});

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
			request_parameters: {
				"method.request.path.accountId": true,
				"method.request.path.socialId": true
			}
		});
	});

	it("should create a correct resource when there are normal query string params", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const result = generateGatewayMethod({
			uniqueName: "index",
			gatewayResourceId: "index",
			queryStringParams: [
				{
					name: "accountId",
					mandatory: false
				},
				{
					name: "socialId",
					mandatory: false
				}
			]
		});

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
			request_parameters: {
				"method.request.querystring.accountId": false,
				"method.request.querystring.socialId": false
			}
		});
	});

	it("should create a correct resource when there are both type of params", () => {
		setConfiguration({
			gatewayKey: "CustomKey"
		});

		const result = generateGatewayMethod({
			uniqueName: "index",
			gatewayResourceId: "index",
			queryStringParams: [
				{
					name: "accountId",
					mandatory: false
				},
				{
					name: "socialId",
					mandatory: false
				}
			],
			params: [
				{
					name: "url",
					mandatory: true
				}
			]
		});

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
			request_parameters: {
				"method.request.querystring.accountId": false,
				"method.request.querystring.socialId": false,
				"method.request.path.url": true
			}
		});
	});
});
