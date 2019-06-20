/* eslint-disable */
export declare namespace terranext {
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

export declare namespace AWS {
	interface Method {
		[key: string]: AWS.GatewayMethod;
	}

	interface Resource {
		[key: string]: AWS.GatewayResource;
	}

	interface Integration {
		[key: string]: AWS.GatewayIntegration;
	}

	interface RequestParameter {
		[key: string]: { name: string };
	}

	interface Lambda {
		aws_lambda_function: AWS.LambdaFunction;
		aws_lambda_permission: AWS.LambdaPermission;
	}

	interface LambdaData {}

	interface GatewayMethod {
		rest_api_id: string;
		resource_id: string;
		http_method: string;
		authorization: string;
		request_parameters?: AWS.RequestParameter;
	}

	interface GatewayIntegration {
		rest_api_id: string;
		resource_id: string;
		http_method: string;
		integration_http_method: string;
		type: string;
		uri: string;
		request_parameters?: AWS.RequestParameter;
	}

	interface GatewayResource {
		rest_api_id: string;
		parent_id: string;
		path_part: string;
	}

	interface LambdaFunction {
		[key: string]: AWS.Function;
	}

	interface Function {
		filename: string;
		function_name: string;
		source_code_hash: string;
		handler: string;
		runtime: string;
		memory_size: string;
		timeout: string;
		role: string;
	}
	interface LambdaPermission {
		[key: string]: {
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
