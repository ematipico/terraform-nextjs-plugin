/* eslint-disable */
declare namespace terranext {
	interface Configuration {
		gatewayKey?: string;

		lambdaPath?: string;

		routes?: terranext.Route[];
	}

	interface Result {
		gateway: terranext.GatewayResources;
		lambdas: terranext.LambdaResources;
	}

	interface Route {
		prefix: string;

		mappings: terranext.Mapping[];
	}

	interface Mapping {
		page: string;

		route: string;
	}

	interface GatewayResources {
		resource: {
			aws_api_gateway_resource: AWS.Resource;
			aws_api_gateway_method: AWS.Method;
			aws_api_gateway_integration: AWS.Integration;
		};
		variable: {
			integrationList: {
				default: string[];
			};
		};
	}

	interface LambdaResources {
		resource: AWS.Lambda;
		data: AWS.LambdaData;
	}
}

declare namespace AWS {
	interface Method {
		[key as string]: AWS.GatewayMethod;
	}

	interface Resource {
		[key as string]: AWS.GatewayResource;
	}

	interface Integration {
		[key as string]: AWS.GatewayIntegration;
	}

	interface RequestParameter {
		[key as string]: string;
	}

	interface Lambda {
		aws_lambda_function: AWS.LambdaFunction;
		aws_lambda_permission: AWS.LambdaPermission;
	}

	interface GatewayMethod {
		rest_api_id: string;
		resource_id: string;
		http_method: string;
		authorization: string;
		request_parameters: AWS.RequestParameter;
	}

	interface GatewayIntegration {
		rest_api_id: string;
		resource_id: string;
		http_method: string;
		integration_http_method: string;
		type: string;
		uri: string;

		request_parameters: AWS.RequestParameter;
	}

	interface GatewayResource {
		rest_api_id: string;
		parent_id: string;
		path_part: string;
	}

	interface LambdaFunction {
		[key as string]: {
			filename: string;
			function_name: string;
			source_code_hash: string;
			handler: string;
			runtime: string;
			memory_size: string;
			timeout: string;
			role: string;
		};
	}
	interface LambdaPermission {
		[key as string]: {
			statement_id: string;
			action: string;
			function_name: string;
			principal: string;
			source_arn: string;
		};
	}
}

declare function terranext(configuration: terranext.Configuration, write: boolean): Promise<void>;
declare function terranext(configuration: terranext.Configuration): Promise<terranext.Result>;
declare function terranext(): Promise<terranext.Result>;

export = terranext;
