class LambdaProperties {
	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	/**
	 * @returns {string}
	 */
	getLambdaPrefix() {
		return `lambdaFor${this.config.getGatewayKey()}`;
	}

	/**
	 * It generates the Lambda resource
	 *
	 * @returns {import('../declarations').GenerateLambdaResource}
	 */
	generateLambdaProperties() {
		const cleanedId = this.options.id.replace(/\[|\]/g, "");
		const lambdaId = `${this.getLambdaPrefix()}-${cleanedId}`;
		return {
			resourceUniqueId: lambdaId,
			resource: {
				filename: "${data.archive_file.packLambda-" + cleanedId + ".output_path}",
				function_name: "${local.groupname}-" + cleanedId,
				source_code_hash: "${data.archive_file.packLambda-" + cleanedId + ".output_base64sha256}",
				handler: this.options.id + ".render",
				runtime: "nodejs8.10",
				memory_size: "1024",
				timeout: "180",
				role: "${local.lambda_iam_role}"
			}
		};
	}
}

module.exports = LambdaProperties;
