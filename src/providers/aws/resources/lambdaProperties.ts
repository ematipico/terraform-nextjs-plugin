import AwsConfig from "../awsConfig";
import { LambdaOptions } from "./lambda";

interface Environment {
	variables: {
		[key: string]: string
	}
}
export interface LambdaFunctionResourceSpec {
	filename: string;
	function_name: string;
	source_code_hash: string;
	handler: string;
	runtime: string;
	memory_size: string;
	timeout: string;
	role: string;
	environment?: Environment;
}

export interface GenerateLambdaResource {
	resourceUniqueId: string;
	resource: LambdaFunctionResourceSpec;
}

export default class LambdaProperties {
	private config: AwsConfig;
	private options: LambdaOptions;

	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	generateLambdaProperties(): GenerateLambdaResource {
		const cleanedId = this.options.id.replace(/\[|]/g, "");
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		const resource: GenerateLambdaResource = {
			resourceUniqueId: lambdaId,
			resource: {
				filename: "${data.archive_file.packLambda-" + cleanedId + ".output_path}",
				function_name: "${local.groupname}-" + cleanedId,
				source_code_hash: "${data.archive_file.packLambda-" + cleanedId + ".output_base64sha256}",
				handler: this.options.id + ".render",
				runtime: this.config.getNodeVersion(),
				memory_size: "1024",
				timeout: "180",
				role: "${local.lambda_iam_role}",
			},
		};
		if (this.config.hasEnvs()) {
			resource.resource.environment = {
				variables: this.config.getEnvs(),
			};
		}

		return resource;
	}
}

