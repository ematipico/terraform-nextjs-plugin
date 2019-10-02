const { getLambdaPath } = require("../../../configuration");
const path = require("path");

/** @typedef {import('../aws').AWS.Data} Data */

/** @typedef {{ uniqueId: string; resource: Data }} Result */

/**
 * It generates the Lambda resource
 *
 * @param {object} options
 * @param {string} options.id
 * @param {string} options.directoryName
 * @returns {Result}
 */
function generateZipResource({ id, directoryName }) {
	const cleanedId = id.replace(/\[|\]/g, "");

	return {
		uniqueId: `packLambda-${cleanedId}`,
		resource: {
			output_path: "files/${local.groupname}-" + id + ".zip",
			type: "zip",
			// eslint-disable-next-line unicorn/prevent-abbreviations
			source_dir: path.join(getLambdaPath(), directoryName)
		}
	};
}

module.exports = { generateZipResource };
