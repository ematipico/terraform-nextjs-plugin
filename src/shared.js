const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

/** @typedef {import('./declarations').terranext.Route} Route */

/**
 * It returns the files inside a folder
 *
 * @param {string} lambdaPath The Path to the lambdas
 * @returns {Promise<string[]>}
 */
async function getLambdaFiles(lambdaPath) {
	const readDirectory = promisify(fs.readdir);

	const files = await readDirectory(lambdaPath);

	return files.map(file => {
		const pathToFile = path.resolve(lambdaPath, file);
		if (fs.existsSync(pathToFile) && fs.lstatSync(pathToFile).isDirectory()) {
			return file + ".js";
		}
		return file;
	});
}

/**
 * It returns a Route object from a list of files
 *
 * @param {string[]} files An array of file names
 * @returns {Route}
 */
function generateMappingsFromFiles(files) {
	const mappings = files.reduce((mappings, file) => {
		const normalizedFile = "/" + file.replace(".js", "");
		mappings.push({
			route: normalizedFile,
			page: normalizedFile
		});

		return mappings;
	}, []);

	return {
		prefix: "",
		mappings
	};
}

module.exports = {
	getLambdaFiles,
	generateMappingsFromFiles
};
