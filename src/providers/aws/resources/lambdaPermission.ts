import AwsConfig from "../awsConfig";
import { LambdaOptions } from "./lambda";

export interface LambdaPermissionResourceSpec {
	statement_id: string;
	action: string;
	function_name: string;
	principal: string;
	source_arn: string;
}

export interface LambdaPermissionResources {
	permissionUniqueId: string;
	resource: LambdaPermissionResourceSpec;
}

export default class LambdaPermission {
	readonly config: AwsConfig;
	readonly options: LambdaOptions;

	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	generateLambdaPermissions(): LambdaPermissionResources {
		const cleanedId = this.options.id.replace(/\[|]/g, "");
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		return {
			permissionUniqueId: lambdaId,
			resource: {
				statement_id: "AllowExecutionFromAPIGateway",
				action: "lambda:InvokeFunction",
				function_name: "${aws_lambda_function." + lambdaId + ".function_name}",
				principal: "apigateway.amazonaws.com",
				source_arn: "${aws_api_gateway_rest_api." + this.config.getGatewayKey() + ".execution_arn}/*/*/*",
			},
		};
	}
}

