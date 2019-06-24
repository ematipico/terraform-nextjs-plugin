const { checkConfiguration, setConfiguration } = require("./configuration");
const { generateTerraformConfiguration } = require("./providers/aws");
const { generateLambdas } = require("./providers/aws");
const cosmiconfig = require("cosmiconfig");

/**
 * @typedef {import("./index").terranext.Configuration} Configuration
 * @typedef {import("./index").terranext.Result} Result
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
		checkConfiguration({
			...fileConfiguration,
			...configuration
		});
		setConfiguration(configuration);
		if (write === true) {
			generateTerraformConfiguration(write);
			generateLambdas(write);
		} else {
			return {
				gateway: generateTerraformConfiguration(),
				lambdas: generateLambdas()
			};
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);
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
