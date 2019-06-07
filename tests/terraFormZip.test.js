const { generateZipResource } = require("../src/resources/terraFormZip");
const { setConfiguration } = require("../src/configuration");
const path = require("path");
describe("terraFormZip", () => {
	it("should create the correct resource", () => {
		setConfiguration({
			lambdaPath: "../../fake/path"
		});

		const result = generateZipResource({ id: "index", directoryName: "index" });
		expect(result.uniqueId).toBe("packLambda-index");
		expect(result.resource).toStrictEqual({
			output_path: "files/${local.groupname}-index.zip",
			type: "zip",
			// eslint-disable-next-line unicorn/prevent-abbreviations
			source_dir: path.join("../../fake/path", "index")
		});
	});
});
