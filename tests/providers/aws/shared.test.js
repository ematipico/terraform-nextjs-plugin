const { generateMappingsFromFiles, getLambdaFiles, generateMappingsFromPagesFolder } = require("../../../src/shared");
const path = require("path");

describe("shared.js", () => {
	describe("generateMappingsFromFiles", () => {
		it("should generate a routes object from files", () => {
			const routes = generateMappingsFromFiles(["file.js", "file2.js", "boar.js"]);

			expect(routes).toStrictEqual({
				prefix: "",
				mappings: [
					{
						page: "/file",
						route: "/file"
					},
					{
						page: "/file2",
						route: "/file2"
					},
					{
						page: "/boar",
						route: "/boar"
					}
				]
			});
		});
	});

	it("should generate routes object from a real folder", async () => {
		const lambdaPath = path.resolve(__dirname, "__fixtures__", "pages");
		const files = await getLambdaFiles(lambdaPath);
		const routes = generateMappingsFromFiles(files);
		expect(routes).toEqual({
			prefix: "",
			mappings: [
				{
					page: "/boar",
					route: "/boar"
				},
				{
					page: "/contact-us",
					route: "/contact-us"
				},
				{
					page: "/index",
					route: "/index"
				}
			]
		});
	});

	it("should generate routes from next 9 folder structure", async () => {
		const testPath = path.resolve(__dirname, "__fixtures__", "next9", "pages");

		const routes = await generateMappingsFromPagesFolder(testPath);
		expect(routes).toEqual({
			prefix: "",
			mappings: [
				{
					page: "/deep",
					route: "/:foo/:deep"
				},
				{
					page: "/query",
					route: "/:foo/:query"
				},
				{
					page: "/bar",
					route: "/:foo/bar"
				},
				{
					page: "/fixed",
					route: "/:foo/fixed"
				}
			]
		});
	});
});
