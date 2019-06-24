const { generateZipResource } = require("./resources/terraFormZip");
const { generateGatewayMethod } = require("./resources/terraFormGatewayMethod");
const { generateGatewayIntegration } = require("./resources/terraFormGatewayIntegration");
const { generateGatewayResource } = require("./resources/terraFormGatewayResource");
const { generateLambdaResource } = require("./resources/terraFormLambda");

module.exports = {
	generateZipResource,
	generateGatewayMethod,
	generateGatewayIntegration,
	generateGatewayResource,
	generateLambdaResource
};
