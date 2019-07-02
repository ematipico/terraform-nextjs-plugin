const fs = require("fs");
const { promisify } = require("util");

/**
 *
 *
 * @param {string} path The Path to the lambdas
 * @returns {Promise<string[]>}
 */
function getLambdaFiles(path) {
	const readDirectory = promisify(fs.readdir);

	return readDirectory(path);
}

module.exports = {
	getLambdaFiles
};
