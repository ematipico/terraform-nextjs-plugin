const path = require("path");

/** @typedef {import('../aws.declarations').AWS.Data} Data */
/** @typedef {{ uniqueId: string; resource: Data }} Result */

class LambdaZip {
	constructor(config, options) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the Lambda resource
	 * @returns {Result}
	 */
	generateZipResource() {
		const cleanedId = this.options.id.replace(/\[|\]/g, "");

		return {
			uniqueId: `packLambda-${cleanedId}`,
			resource: {
				output_path: "files/${local.groupname}-" + this.options.id + ".zip",
				type: "zip",
				// eslint-disable-next-line unicorn/prevent-abbreviations
				source_dir: path.join(this.config.getLambdaPath(), this.options.directoryName)
			}
		};
	}
}

module.exports = LambdaZip;
