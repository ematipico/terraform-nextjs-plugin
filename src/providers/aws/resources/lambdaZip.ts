import { join } from "path";
import AwsConfig from "../awsConfig";
import { LambdaOptions } from "./lambda";

export interface LambdaZipResourceSpec {
	output_path: string;
	type: string;
	source_dir: string;
}

export interface LambdaZipResource {
	uniqueId: string;
	resource: LambdaZipResourceSpec;
}

export default class LambdaZip {
	private readonly config: AwsConfig;
	private readonly options: LambdaOptions;

	constructor(config: AwsConfig, options: LambdaOptions) {
		this.config = config;
		this.options = options;
	}

	generateZipResource(): LambdaZipResource {
		const cleanedId = this.options.id.replace(/\[|]/g, "");

		return {
			uniqueId: `packLambda-${cleanedId}`,
			resource: {
				output_path: "files/${local.groupname}-" + this.options.id + ".zip",
				type: "zip",
				source_dir: join(this.config.getLambdaPath(), this.options.directoryName),
			},
		};
	}
}
