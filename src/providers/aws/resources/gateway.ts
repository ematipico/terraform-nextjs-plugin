import GatewayIntegration, { GatewayIntegrationResource } from "./gatewayIntegration";
import GatewayResource, { GenerateGatewayResource } from "./gatewayResource";
import GatewayMethod, { GatewayMethodResource } from "./gatewayMethod";
import AwsConfig from "../awsConfig";

export interface Param {
	name: string;
	mandatory?: boolean;
}

export interface AwsGatewayOptions {
	parentId?: string;
	id: string;
	isUrlParameter?: boolean;
	pathname: string;
	params?: Param[];
	queryStringParams?: Param[];
	lambdaName: string;
}

export default class Gateway {
	readonly gatewayIntegration: GatewayIntegration;
	readonly gatewayMethod: GatewayMethod;
	readonly gatewayResource: GatewayResource;

	constructor(config: AwsConfig, options: AwsGatewayOptions) {
		this.gatewayIntegration = new GatewayIntegration(config, options);
		this.gatewayMethod = new GatewayMethod(config, options);
		this.gatewayResource = new GatewayResource(config, options);
	}

	/**
	 * @returns
	 */
	getResource(): GenerateGatewayResource {
		return this.gatewayResource.generateGatewayResource();
	}

	/**
	 *
	 * @param {string} gatewayResourceId
	 * @returns {{resource: {authorization: string, rest_api_id: *, http_method: string, resource_id: string}, uniqueId: string}}
	 */
	getMethod(gatewayResourceId): GatewayMethodResource {
		return this.gatewayMethod.generateGatewayMethod(gatewayResourceId);
	}

	/**
	 *
	 * @param {string} gatewayResourceId
	 */
	getIntegration(gatewayResourceId): GatewayIntegrationResource {
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
