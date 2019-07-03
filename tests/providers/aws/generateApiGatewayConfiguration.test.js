// @ts-nocheck
const { generateTerraformConfiguration } = require("../../../src/providers/aws/generateApiGatewayConfiguration");
const { setConfiguration } = require("../../../src/configuration");
const path = require("path");

describe("generateTerraformConfiguration", () => {
	it("should generate the correct configuration", async () => {
		setConfiguration({
			gatewayKey: "CustomKey",
			lambdaPath: path.resolve(__dirname, "__fixtures__"),
			routes: {
				prefix: "",
				mappings: [
					{
						page: "/blog-post",
						route: "/new-blog-post-amazing"
					},
					{
						page: "/singleBlogPost",
						route: "/blog/:url"
					},
					{
						page: "/blogPost",
						route: "/blog/detail/:url",
						params: {
							page: true,
							hideComments: false
						}
					}
				]
			}
		});

		const result = await generateTerraformConfiguration();

		expect(result).toMatchSnapshot();
	});
});
