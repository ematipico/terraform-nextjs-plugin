const LambdaProperties = require("../../../src/providers/aws/resources/lambdaProperties");
const AwsConfig = require("../../../src/providers/aws/awsConfig");

describe("terraFormLambda", () => {
	it("should create the correct resource", () => {
		const c = new AwsConfig({
			gatewayKey: "CustomKey"
		});

		const properties = new LambdaProperties(c, {
			id: "index",
			directoryName: "/test"
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
			role: "${local.lambda_iam_role}"
		});
	});
});
