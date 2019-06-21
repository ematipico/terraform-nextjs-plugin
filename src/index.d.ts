import { AWS } from "./aws";

declare namespace terranext {
	interface Configuration {
		gatewayKey?: string;
		lambdaPath?: string;
		routes?: terranext.Route[] | terranext.Route;
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

		params?: {
			[key: string]: boolean;
		};
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
		resource?: AWS.Lambdas;
		data: {
			archive_file: AWS.LambdaData;
		};
	}
}

declare function terranext(configuration: terranext.Configuration, write: boolean): Promise<void>;
declare function terranext(configuration: terranext.Configuration): Promise<terranext.Result>;
declare function terranext(): Promise<terranext.Result>;

export = terranext;
