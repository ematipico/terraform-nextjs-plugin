import AwsConfig from "../awsConfig";
import { AwsGatewayOptions } from "./gateway";

export interface GatewayResourceSpec {
	rest_api_id: string;
	parent_id: string;
	path_part: string;
}

export interface GenerateGatewayResource {
	uniqueId: string;
	resource: GatewayResourceSpec;
}

export default class GatewayResource {
	private readonly config: AwsConfig;
	private readonly options: AwsGatewayOptions;
	private readonly parentResourceName: string;

	constructor(config, options) {
		this.config = config;
		this.options = options;
		this.parentResourceName = this.createUniqueId(this.options.parentId);
	}

	/**
	 * It generates the ApiGateway resource
	 * @returns
	 */
	generateGatewayResource(): GenerateGatewayResource {
		return {
			uniqueId: this.generateUniqueId(),
			resource: this.generateResource(),
		};
	}

	/**
	 *
	 * @returns string
	 */
	generateUniqueId() {
		return `${this.config.getGatewayKey()}-${this.options.id}`;
	}

	/**
	 *
	 * @returns string
	 */
	createUniqueId(id) {
		if (!id) return;
		return `${this.config.getGatewayKey()}-${id}`;
	}

	/**
	 * It generates the single resource
	 */
	generateResource(): GatewayResourceSpec {
		return {
			rest_api_id: this.config.getGatewayResourceId(),
			parent_id: this.options.parentId ? "${aws_api_gateway_resource." + this.parentResourceName + ".id}" : this.config.getRootResource(),
			path_part: this.options.isUrlParameter ? `{${this.options.pathname}}` : this.options.pathname,
		};
	}
}
