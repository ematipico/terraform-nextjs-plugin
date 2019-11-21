import { AWS } from "./providers/aws/aws.declarations";
import { Param } from "./providers/aws/declarations";

	export interface Configuration {
		gatewayKey?: string;
		nextAppDir?: string;
		routes?: Route[] | Route;
		buildPath?: string;
		provider: string;
		nodeVersion?: "8" | "10" | "12";
	}

	export interface Result<G, L> {
		gateway: G;
		lambdas: L;
	}

	export interface Route {
		prefix?: string;

		mappings: Mapping[];
	}

	export interface Mapping {
		page: string;

		route: string;

		params?: Param[];
	}

	export interface GatewayResources {
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

declare function terranext<G, L>(configuration: Configuration, write: boolean): Promise<void>;
declare function terranext<G, L>(configuration: Configuration): Promise<Result<G, L>>;
declare function terranext<G, L>(): Promise<Result<G, L>>;

export default terranext;
