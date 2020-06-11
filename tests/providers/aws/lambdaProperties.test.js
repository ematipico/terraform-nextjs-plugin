const LambdaProperties = require("../../../src/providers/aws/resources/lambdaProperties");
const AwsConfig = require("../../../src/providers/aws/awsConfig");

describe("terraFormLambda", () => {
	it("should create the correct resource", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			provider: "AWS",
		});

		const properties = new LambdaProperties(c, {
			id: "index",
			directoryName: "/test",
		});

		const result = properties.generateLambdaProperties();

		expect(result.resourceUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.resource).toStrictEqual({
			filename: "${data.archive_file.packLambda-index.output_path}",
			function_name: "${local.groupname}-index",
			source_code_hash: "${data.archive_file.packLambda-index.output_base64sha256}",
			handler: "index.render",
			runtime: "nodejs8.10",
			memory_size: "1024",
			timeout: "180",
			role: "${local.lambda_iam_role}",
		});
	});

	it("return the correct node version 10", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			nodeVersion: "10",
			provider: "AWS",
		});

		const properties = new LambdaProperties(c, {
			id: "index",
			directoryName: "/test",
		});

		const result = properties.generateLambdaProperties();

		expect(result.resourceUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.resource.runtime).toEqual("nodejs10.x");
	});

	it("return the correct node version 12", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			nodeVersion: "12",
			provider: "AWS",
		});

		const properties = new LambdaProperties(c, {
			id: "index",
			directoryName: "/test",
		});

		const result = properties.generateLambdaProperties();

		expect(result.resourceUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.resource.runtime).toEqual("nodejs12.x");
	});

	it("should return the environment variables", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey",
			nodeVersion: "12",
			provider: "AWS",
			env: [
				{
					key: "PROD_KEY",
					value: "230402",
				},
			],
		});

		const properties = new LambdaProperties(c, {
			id: "index",
			directoryName: "/test",
		});

		const result = properties.generateLambdaProperties();

		expect(result.resourceUniqueId).toBe("lambdaForCustomKey-index");
		expect(result.resource.environment).toBeTruthy();
		expect(result.resource.environment).toStrictEqual({
			variables: {
				PROD_KEY: "230402",
			},
		});
	});
});
