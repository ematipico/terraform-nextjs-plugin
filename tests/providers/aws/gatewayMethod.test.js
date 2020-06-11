const AwsConfig = require("../../../src/providers/aws/awsConfig");
const GatewayMethod = require("../../../src/providers/aws/resources/gatewayMethod");

describe("terraFormGatewayMethod", () => {
	it("should create a correct resource", () => {
		const config = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS",
		});

		const method = new GatewayMethod(config, {
			id: "index",
			pathname: "/",
			lambdaName: "index",
		});

		const result = method.generateGatewayMethod("index");

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
		});
	});

	it("should create a correct resource when there are normal params", () => {
		const config = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS",
		});

		const method = new GatewayMethod(config, {
			id: "index",
			pathname: "/",
			lambdaName: "index",
			params: [
				{
					name: "accountId",
					mandatory: true,
				},
				{
					name: "socialId",
					mandatory: true,
				},
			],
		});

		const result = method.generateGatewayMethod("index");

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
			request_parameters: {
				"method.request.path.accountId": true,
				"method.request.path.socialId": true,
			},
		});
	});

	it("should create a correct resource when there are normal query string params", () => {
		const config = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS",
		});

		const method = new GatewayMethod(config, {
			id: "index",
			pathname: "/",
			lambdaName: "index",
			queryStringParams: [
				{
					name: "accountId",
					mandatory: false,
				},
				{
					name: "socialId",
					mandatory: false,
				},
			],
		});

		const result = method.generateGatewayMethod("index");

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
			request_parameters: {
				"method.request.querystring.accountId": false,
				"method.request.querystring.socialId": false,
			},
		});
	});

	it("should create a correct resource when there are both type of params", () => {
		const config = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS",
		});

		const method = new GatewayMethod(config, {
			id: "index",
			pathname: "/",
			lambdaName: "index",
			queryStringParams: [
				{
					name: "accountId",
					mandatory: false,
				},
				{
					name: "socialId",
					mandatory: false,
				},
			],
			params: [
				{
					name: "url",
					mandatory: true,
				},
			],
		});

		const result = method.generateGatewayMethod("index");

		expect(result.uniqueId).toBe("CustomKey-index");
		expect(result.resource).toStrictEqual({
			rest_api_id: "${aws_api_gateway_rest_api.CustomKey.id}",
			resource_id: "${aws_api_gateway_resource.index.id}",
			http_method: "GET",
			authorization: "NONE",
			request_parameters: {
				"method.request.querystring.accountId": false,
				"method.request.querystring.socialId": false,
				"method.request.path.url": true,
			},
		});
	});
});
