// @ts-nocheck
const { generateTerraformConfiguration } = require("../../../src/providers/aws/generateApiGatewayConfiguration");
const { setConfiguration } = require("../../../src/configuration");

describe("generateTerraformConfiguration", () => {
	it("should generate the correct configuration", () => {
		setConfiguration({
			gatewayKey: "CustomKey",
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

		const result = generateTerraformConfiguration();

		expect(result).toMatchSnapshot();
	});
});
