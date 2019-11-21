const LambdaZip = require("../../../src/providers/aws/resources/lambdaZip");
const AwsConfig = require("../../../src/providers/aws/awsConfig");

describe("terraFormZip", () => {
	it("should create the correct resource", () => {
		const config = new AwsConfig({
			lambdaPath: "../../fake/path"
		});

		const zip = new LambdaZip(config, {
			id: "index",
			directoryName: "index"
		});

		const result = zip.generateZipResource();
		expect(result.uniqueId).toBe("packLambda-index");
		expect(result.resource.output_path).toEqual("files/${local.groupname}-index.zip");
		expect(result.resource.type).toEqual("zip");
		expect(result.resource.source_dir).toContain("lambdas");
	});
});
