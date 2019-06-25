const { generateTerraformConfiguration } = require("./generateApiGatewayConfiguration");
const { generateLambdas } = require("./generateLambdas");

module.exports = {
	generateTerraformConfiguration,
	generateLambdas
};
