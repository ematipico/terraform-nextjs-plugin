/**
 * @typedef {import('../awsConfig')} AwsConfig
 */
/**
 * @typedef {import('../declarations').LambdaOptions} LambdaOptions
 */
class LambdaProperties {
	/**
	 *
	 * @param {AwsConfig} config
	 * @param {LambdaOptions} options
	 */
	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the Lambda resource
	 *
	 * @returns {import('../declarations').GenerateLambdaResource}
	 */
	generateLambdaProperties() {
		const cleanedId = this.options.id.replace(/\[|\]/g, "");
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		return {
			resourceUniqueId: lambdaId,
			resource: {
				filename: "${data.archive_file.packLambda-" + cleanedId + ".output_path}",
				function_name: "${local.groupname}-" + cleanedId,
				source_code_hash: "${data.archive_file.packLambda-" + cleanedId + ".output_base64sha256}",
				handler: this.options.id + ".render",
				runtime: this.config.getNodeVersion(),
				memory_size: "1024",
				timeout: "180",
				role: "${local.lambda_iam_role}"
			}
		};
	}
}

module.exports = LambdaProperties;
