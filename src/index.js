const { checkConfiguration, setConfiguration } = require("./configuration");
const { generateTerraformConfiguration } = require("./providers/aws");
const { generateLambdas } = require("./providers/aws");
const cosmiconfig = require("cosmiconfig");

/**
 * @typedef {import("./declarations").terranext.Configuration} Configuration
 * @typedef {import("./declarations").terranext.Result} Result
 */

/**
 *
 * @param {Configuration} configuration The configuration needed to generate the resources
 * @param {boolean} [write=false]
 * @returns {Promise<Result>}
 */
async function terranext(configuration, write = false) {
	try {
		const fileConfiguration = retrieveConfiguration();
		const finalConfiguration = {
			...fileConfiguration,
			...configuration
		};
		const result = checkConfiguration(finalConfiguration);
		if (result === true) {
			setConfiguration(configuration);
			if (write === true) {
				await generateTerraformConfiguration(write);
				await generateLambdas(write);
			} else {
				const lambdas = await generateLambdas();
				const gateway = await generateTerraformConfiguration();
				return {
					gateway,
					lambdas
				};
			}
		} else {
			// eslint-disable-next-line no-console
			console.error(result);
			process.exit(1);
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
