// @ts-nocheck
const { generateZipResource } = require("../../../src/providers/aws/resources/terraFormZip");
const { setConfiguration } = require("../../../src/configuration");
describe("terraFormZip", () => {
	it("should create the correct resource", () => {
		setConfiguration({
			lambdaPath: "../../fake/path"
		});

		const result = generateZipResource({ id: "index", directoryName: "index" });
		expect(result.uniqueId).toBe("packLambda-index");
		expect(result.resource.output_path).toEqual("files/${local.groupname}-index.zip");
		expect(result.resource.type).toEqual("zip");
		expect(result.resource.source_dir).toContain("lambdas");
	});
});
