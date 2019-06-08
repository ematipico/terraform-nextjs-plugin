const { checkConfiguration, setConfiguration } = require("./configuration");
const {
	generateTerraformConfiguration
} = require("./generateApiGatewayConfiguration");
const { generateLambdas } = require("./generateLambdas");
const cosmiconfig = require("cosmiconfig");

/**
 *
 * @param {*} configuration The configuration needed to generate the resources
 * @param {boolean} [write=false]
 */
async function generateResources(configuration, write = false) {
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

module.exports = {
	generateResources
};
