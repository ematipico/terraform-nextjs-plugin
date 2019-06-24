import { AWS } from "./providers/aws/aws";

export declare namespace terranext {
	interface Configuration {
		gatewayKey?: string;
		lambdaPath?: string;
		routes?: terranext.Route[] | terranext.Route;
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

declare function terranext<G, L>(configuration: terranext.Configuration, write: boolean): Promise<void>;
declare function terranext<G, L>(configuration: terranext.Configuration): Promise<terranext.Result<G, L>>;
declare function terranext<G, L>(): Promise<terranext.Result<G, L>>;
