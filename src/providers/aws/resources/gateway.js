const GatewayIntegration = require("./gatewayIntegration");
const GatewayMethod = require("./gatewayMethod");
const GatewayResource = require("./gatewayResource");

/** @typedef {import('../aws.declarations').AWS.GatewayIntegration} GatewayIntegrationObject */
/** @typedef {import('../declarations').Param} Param */
/** @typedef {import('../declarations').AwsGatewayOptions} AwsGatewayOptions */
/**
 * @typef {} AwsConfig
 */

class Gateway {
	/**
	 *
	 * @param config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config, options) {
		this.gatewayIntegration = new GatewayIntegration(config, options);
		this.gatewayMethod = new GatewayMethod(config, options);
		this.gatewayResource = new GatewayResource(config, options);
	}

	/**
	 * @returns
	 */
	getResource() {
		return this.gatewayResource.generateGatewayResource();
	}

	/**
	 *
	 * @param {string} gatewayResourceId
	 * @returns {{resource: {authorization: string, rest_api_id: *, http_method: string, resource_id: string}, uniqueId: string}}
	 */
	getMethod(gatewayResourceId) {
		return this.gatewayMethod.generateGatewayMethod(gatewayResourceId);
	}

	/**
	 *
	 * @param {string} gatewayResourceId
	 * @returns {{uniqueId: string, resource: GatewayIntegrationObject}}
	 */
	getIntegration(gatewayResourceId) {
		return this.gatewayIntegration.generateGatewayIntegration(gatewayResourceId);
	}

	/**
	 * @returns {object}
	 */
	generate() {
		const resource = this.getResource();
		const method = this.getMethod(resource.uniqueId);
		const integration = this.getIntegration(resource.uniqueId);

		return {
			resource,
			method,
			integration,
		};
	}
}

module.exports = Gateway;
