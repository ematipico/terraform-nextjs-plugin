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
		const cleanedId = this.options.id.replace(/\[|]/g, "");
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		const resource = {
			resourceUniqueId: lambdaId,
			resource: {
				filename: `\${data.archive_file.packLambda-${cleanedId}.output_path}`,
				function_name: `\${local.groupname}-${cleanedId}`,
				source_code_hash: `\${data.archive_file.packLambda-${cleanedId}.output_base64sha256}`,
				handler: `${this.options.id}.render`,
				runtime: this.config.getNodeVersion(),
				memory_size: this.config.getMemorySize(),
				timeout: this.config.getTimeout(),
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

module.exports = LambdaProperties;
