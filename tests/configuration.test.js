const { checkConfiguration, setConfiguration, getGatewayKey, getGatewayResourceId } = require("../src/configuration");

describe("Configuration", () => {
	it("should throw an error when configuration is empty", () => {
		expect(() => checkConfiguration()).toThrowError("Empty configuration, cannot proceed.");
	});

	it("should throw an error when gatewayKey is not provided", () => {
		expect(() => checkConfiguration({})).toThrowError("gatewayKey is missing, it must be provided");
	});

	it("should throw an error when gatewayKey is not provided", () => {
		expect(() => checkConfiguration({ gatewayKey: "myTest" })).toThrowError("lambdaPath is missing, it must be provided");
	});

	it("should throw an error when routes is not provided", () => {
		expect(() => checkConfiguration({ gatewayKey: "myTest", lambdaPath: "/path" })).toThrowError("routes is missing, it must be provided");
	});

	it("should throw an error when routes is are malformed", () => {
		expect(() =>
			checkConfiguration({
				gatewayKey: "myTest",
				lambdaPath: "/path",
				routes: {
					prefix: "",
					mappings: [
						{
							page: "/"
						}
					]
				}
			})
		).toThrowError("The object containing the routes is not correct");

		expect(() =>
			checkConfiguration({
				gatewayKey: "myTest",
				lambdaPath: "/path",
				routes: [
					{
						prefix: "home",
						mappings: [
							{
								page: "/content",
								route: "ehy"
							}
						]
					},
					{
						prefix: "blog",
						mappings: [
							{
								route: "ehy"
							}
						]
					}
				]
			})
		).toThrowError("The object containing the routes is not correct");
	});

	it("should return true when the configuration is sane", () => {
		expect(
			checkConfiguration({
				gatewayKey: "myTest",
				lambdaPath: "/path",
				routes: {
					prefix: "",
					mappings: [
						{
							page: "/content",
							route: "ehy"
						}
					]
				}
			})
		).toBe(true);

		expect(
			checkConfiguration({
				gatewayKey: "myTest",
				lambdaPath: "/path",
				routes: [
					{
						prefix: "home",
						mappings: [
							{
								page: "/content",
								route: "ehy"
							}
						]
					},
					{
						prefix: "blog",
						mappings: [
							{
								page: "/content",
								route: "ehy"
							}
						]
					}
				]
			})
		).toBe(true);
	});

	it("should return the gateway key", () => {
		setConfiguration({ gatewayKey: "myTest", lambdaPath: "/path" });
		expect(getGatewayResourceId()).toEqual("${aws_api_gateway_rest_api.myTest.id}");
	});

	it("should return the gateway key", () => {
		setConfiguration({ gatewayKey: "myTest", lambdaPath: "/path" });
		expect(getGatewayKey()).toEqual("myTest");
	});
});
