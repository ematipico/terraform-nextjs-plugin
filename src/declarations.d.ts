import { AWS } from "./providers/aws/aws";

export declare namespace terranext {
	interface Configuration {
		gatewayKey?: string;
		lambdaPath?: string;
		routes?: terranext.Route[] | terranext.Route;

		provider: string;
	}

	interface Result<G, L> {
		gateway: G;
		lambdas: L;
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
}
