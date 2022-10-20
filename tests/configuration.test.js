/* eslint-disable unicorn/prevent-abbreviations */
// @ts-nocheck

const Configuration = require("../src/configuration");
const AwsConfig = require("../src/providers/aws/awsConfig");
const { PROVIDERS } = require("../src/constants");

describe("Configuration", () => {
	it("should throw an error when configuration is empty", () => {
		const errors = Configuration.checkConfiguration();

		expect(errors).toHaveLength(1);
		const er = errors.find((error) => error.type === "EmptyConfigurationError");
		expect(er.message).toBe("Empty configuration, cannot proceed.");
	});

	it("should throw an error when gatewayKey is not provided", () => {
		const errors = Configuration.checkConfiguration({});
		expect(errors.find((error) => error.message === "gatewayKey is missing, it must be provided")).toBeDefined();
	});

	it("should throw an error when lambdaPath is not provided", () => {
		const errors = Configuration.checkConfiguration({});
		expect(errors.find((error) => error.message === "nextAppDir is missing, it must be provided")).toBeDefined();
	});

	it("should throw an error when routes is are malformed", () => {
		const errors = Configuration.checkConfiguration({
			gatewayKey: "myTest",
			lambdaPath: "/path",
			routes: {
				prefix: "",
				mappings: [
					{
						page: "/",
					},
				],
			},
		});

		expect(errors.find((error) => error.message === "The object containing the routes is not correct")).toBeDefined();

		const errors2 = Configuration.checkConfiguration({
			gatewayKey: "myTest",
			lambdaPath: "/path",
			routes: [
				{
					prefix: "home",
					mappings: [
						{
							page: "/content",
							route: "ehy",
						},
					],
				},
				{
					prefix: "blog",
					mappings: [
						{
							route: "ehy",
						},
					],
				},
			],
		});
		expect(errors2.find((error) => error.message === "The object containing the routes is not correct")).toBeDefined();
	});

	it("should throw an error when memorySize value is invalid", () => {
		const errors = Configuration.checkConfiguration({
			gatewayKey: "myTest",
			lambdaPath: "/path",
			memorySize: "abcd",
		});
		expect(
			errors.find(
				(error) =>
					error.message === "memorySize value is invalid, if it is provided, it must be a string containing a number between 128 and 10240",
			),
		).toBeDefined();
	});

	it("should throw an error when timeout value is invalid", () => {
		const errors = Configuration.checkConfiguration({
			gatewayKey: "myTest",
			lambdaPath: "/path",
			timeout: "abcd",
		});
		expect(
			errors.find(
				(error) =>
					error.message === "timeout value is invalid, if it is provided, it must be a string containing a number smaller than 900",
			),
		).toBeDefined();
	});

	it("should return true when the configuration is correct", () => {
		expect(
			Configuration.checkConfiguration({
				gatewayKey: "myTest",
				nextAppDir: "/path",
				routes: {
					prefix: "",
					mappings: [
						{
							page: "/content",
							route: "ehy",
						},
					],
				},
				provider: "AWS",
			}),
		).toBe(true);

		expect(
			Configuration.checkConfiguration({
				gatewayKey: "myTest",
				nextAppDir: "/path",
				routes: [
					{
						prefix: "home",
						mappings: [
							{
								page: "/content",
								route: "ehy",
							},
						],
					},
					{
						prefix: "blog",
						mappings: [
							{
								page: "/content",
								route: "ehy",
							},
						],
					},
				],

				provider: "AWS",
			}),
		).toBe(true);
	});

	it("should return the gateway key", () => {
		const c = new AwsConfig({ gatewayKey: "myTest", nextAppDir: "/path" });
		expect(c.getGatewayResourceId()).toEqual("${aws_api_gateway_rest_api.myTest.id}");
	});

	it("should return the gateway key", () => {
		const c = new AwsConfig({ gatewayKey: "myTest", nextAppDir: "/path" });
		expect(c.getGatewayKey()).toEqual("myTest");
	});

	it("should throw an error when provider is not passed", () => {
		const errors = Configuration.checkConfiguration({
			gatewayKey: "myTest",
			nextAppDir: "/path",
			routes: {
				prefix: "",
				mappings: [
					{
						page: "/content",
						route: "ehy",
					},
				],
			},
		});
		expect(errors.find((error) => error.message === "provider is missing, it must be provided")).toBeDefined();
	});

	it("should throw an error when provider is not supported", () => {
		const errors = Configuration.checkConfiguration({
			gatewayKey: "myTest",
			nextAppDir: "/path",
			routes: {
				prefix: "",
				mappings: [
					{
						page: "/content",
						route: "ehy",
					},
				],
			},
			// @ts-ignore
			provider: "Azure",
		});

		expect(
			errors.find((error) => error.message === `Azure provider is not supported. Choose between: ${Object.keys(PROVIDERS).join(", ")}`),
		).toBeDefined();
	});
});
