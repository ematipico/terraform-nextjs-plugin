// @ts-ignore
const AwsResources = require("../../../src/providers/aws");
const AwsConfig = require("../../../src/providers/aws/awsConfig");
const path = require("path");

describe("AwsResources", () => {
	it("should generate the correct configuration", async () => {
		const config = new AwsConfig({
			gatewayKey: "CustomKey",
			// eslint-disable-next-line unicorn/prevent-abbreviations
			nextAppDir: path.resolve(__dirname, "__fixtures__"),
			provider: "AWS",
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

		const awsResources = new AwsResources(config);
		const result = await awsResources.generateGatewayResources();

		expect(result).toMatchSnapshot();
	});
});
