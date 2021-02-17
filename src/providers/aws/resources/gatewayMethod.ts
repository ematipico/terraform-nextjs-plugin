import AwsConfig from "../awsConfig";
import { AwsGatewayOptions } from "./gateway";

export interface GatewayMethodResourceSpec {
	rest_api_id: string;
	resource_id: string;
	http_method: string;
	authorization: string;
	request_parameters?: Record<string, boolean>;
}

export interface GatewayMethodResource {
	uniqueId: string;
	resource: GatewayMethodResourceSpec
}

export default class GatewayMethod {
	readonly config: AwsConfig;
	readonly options: AwsGatewayOptions;

	constructor(config: AwsConfig, options: AwsGatewayOptions) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the resource for the single method
	 *
	 * @returns
	 */
	generateGatewayMethod(gatewayResourceId: string): GatewayMethodResource {
		return {
			uniqueId: `${this.config.getGatewayKey()}-${this.options.id}`,
			resource: this.generateResource(gatewayResourceId),
		};
	}

	/**
	 *
	 * @param {string} resourceId
	 */
	generateResource(resourceId): GatewayMethodResourceSpec {
		const resource: GatewayMethodResourceSpec = {
			rest_api_id: this.config.getGatewayResourceId(),
			resource_id: "${aws_api_gateway_resource." + resourceId + ".id}",
			http_method: "GET",
			authorization: "NONE",
		};
		if (this.options.params && this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`method.request.path.${parameter.name}`] = parameter.mandatory;

				return result;
			}, resource.request_parameters || {});
		}
		if (this.options.queryStringParams && this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[`method.request.querystring.${parameter.name}`] = parameter.mandatory;

				return result;
			}, resource.request_parameters || {});
		}
		return resource;
	}
}
