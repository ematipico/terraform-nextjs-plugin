const { checkConfiguration, setConfiguration } = require("./configuration");
const {
	generateTerraformConfiguration
} = require("./generateApiGatewayConfiguration");
const { generateLambdas } = require("./generateLambdas");
/**
 *
 * @param {*} configuration The configuration needed to generate the resources
 * @param {boolean} [write=false]
 */
function generateResources(configuration, write = false) {
	try {
		checkConfiguration(configuration);
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

module.exports = {
	generateResources
};
