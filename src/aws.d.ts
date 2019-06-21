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

	interface Lambdas {
		aws_lambda_function: AWS.LambdaFunction;
		aws_lambda_permission: AWS.LambdaPermission;
	}

	interface LambdaData {
		[key: string]: AWS.Data;
	}

	interface Data {
		output_path: string;
		type: string;
		source_dir: string;
	}

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
		[key: string]: Permission;
	}

	interface Permission {
		statement_id: string;
		action: string;
		function_name: string;
		principal: string;
		source_arn: string;
	}
}
