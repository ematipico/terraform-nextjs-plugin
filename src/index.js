const AwsConfig = require("./providers/aws/awsConfig");
// @ts-ignore
const AwsResources = require("./providers/aws");
// @ts-ignore
const { cosmiconfig } = require("cosmiconfig");
// @ts-ignore
const build = require("next/dist/build").default;

/**
 * @typedef {import("./index").Configuration} Configuration
 * @typedef {import("./index").Result} Result
 */

/**
 *
 * @param {Configuration} configuration The configuration needed to generate the resources
 * @param {boolean} [write=false]
 * @returns {Promise<Result>}
 */
async function terranext(configuration, write = false) {
	try {
		/**
		 * @type {Configuration}
		 */
		const fileConfiguration = await retrieveConfiguration();
		/**
		 *
		 * @type {Configuration}
		 */
		const finalConfiguration = {
			...fileConfiguration,
			...configuration
		};
		const config = new AwsConfig(finalConfiguration);
		const nextConfig = config.getNextConfig();
		// @ts-ignore
		nextConfig.target = "serverless";
		// @ts-ignore
		await build(config.getNextAppDir(), nextConfig);
		const aws = new AwsResources(config);

		if (write === true) {
			await aws.generateGatewayResources(write);
			await aws.generateLambdaResources(write);
		} else {
			const lambdas = await aws.generateLambdaResources();
			const gateway = await aws.generateGatewayResources();
			return {
				gateway,
				lambdas
			};
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		process.exit(1);
	}
}

async function retrieveConfiguration() {
	const explorer = cosmiconfig("terranext");
	try {
		const result = await explorer.search();
		return result.config;
	} catch (error) {
		return undefined;
	}
}

module.exports = terranext;
