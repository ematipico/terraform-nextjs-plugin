import AwsConfig from "../awsConfig";
import { AwsGatewayOptions } from "./gateway";


export interface GatewayIntegrationResourceSpec {
	rest_api_id: string;
	resource_id:string;
	http_method: string;
	integration_http_method: string;
	type: string;
	uri: string;
	request_parameters?: Record<string, string>
}

export interface GatewayIntegrationResource {
	uniqueId: string;
	resource: GatewayIntegrationResourceSpec
}

export default class GatewayIntegration {

	readonly config: AwsConfig;
	readonly options: AwsGatewayOptions;

	constructor(config: AwsConfig, options: AwsGatewayOptions) {
		this.config = config;
		this.options = options;
	}
	/**
	 * It generates the integration resource
	 *
	 * @param {string} gatewayResourceId
	 */
	generateGatewayIntegration(gatewayResourceId): GatewayIntegrationResource {
		return {
			uniqueId: `${this.config.getGatewayKey()}-${this.options.id}`,
			resource: this.generateResource(gatewayResourceId),
		};
	}

	/**
	 *
	 *
	 * @param {string} gatewayResourceId
	 */
	generateResource(gatewayResourceId): GatewayIntegrationResourceSpec {
		const resource: GatewayIntegrationResourceSpec = {
			rest_api_id: "${aws_api_gateway_rest_api." + this.config.getGatewayKey() + ".id}",
			resource_id: "${aws_api_gateway_resource." + gatewayResourceId + ".id}",
			http_method: "GET",
			integration_http_method: "POST",
			type: "AWS_PROXY",
			uri:
				"arn:aws:apigateway:${local.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function." +
				this.config.getLambdaPrefix() +
				"-" +
				this.options.lambdaName +
				".arn}/invocations",
		};

		if (this.options.params && this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`integration.request.path.${parameter.name}`] = `method.request.path.${parameter.name}`;

				return result;
			}, resource.request_parameters || {});
		}

		if (this.options.queryStringParams && this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[`integration.request.querystring.${parameter.name}`] = `method.request.querystring.${parameter.name}`;

				return result;
			}, resource.request_parameters || {});
		}

		return resource;
	}
}

