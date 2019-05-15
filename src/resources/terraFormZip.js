const { getLambdaPath } = require("../configuration");
const path = require("path");
/**
 * It generates the Lambda resource
 *
 * @param {string} id
 * @returns
 */
function generateZipResource({ id, directoryName }) {
	return {
		uniqueId: `packLambda-${id}`,
		resource: {
			output_path: "files/${local.groupname}-" + id + ".zip",
			type: "zip",
			// eslint-disable-next-line unicorn/prevent-abbreviations
			source_dir: path.join(getLambdaPath(), directoryName)
		}
	};
}

module.exports = { generateZipResource };
