const {
	generateTerraformConfiguration
} = require("../src/generateApiGatewayConfiguration");
const { setConfiguration } = require("../src/configuration");

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
					}
				]
			}
		});

		const result = generateTerraformConfiguration();

		expect(result).toMatchSnapshot();
	});
});
