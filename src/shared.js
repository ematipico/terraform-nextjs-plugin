const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

/** @typedef {import('./declarations').terranext.Route} Route */

/**
 *
 * @param {string} fileName
 * @param {string} pathPart
 * @returns {string}
 */
function generatePathFromFile(fileName, pathPart) {
	if (fileName.includes("index") && pathPart) {
		const parts = pathPart.split("/");
		return (
			"/" +
			parts[parts.length - 1]
				.replace(".js", "")
				.replace(":", "")
				.replace(/\[/gm, "")
				.replace(/\]/gm, "")
		);
	}
	return (
		"/" +
		fileName
			.replace(".js", "")
			.replace(/\[/gm, "")
			.replace(/\]/gm, "")
	);
}

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
		const path = generatePathFromFile(file);
		mappings.push({
			route: path,
			page: path
		});

		return mappings;
	}, []);

	return {
		prefix: "",
		mappings
	};
}

/**
 *
 * @param {string} pathToPagesFolder
 * @returns {Route}
 */
function generateMappingsFromPagesFolder(pathToPagesFolder) {
	const mappings = [];

	recursiveBuildMappings(pathToPagesFolder, mappings);

	return {
		prefix: "",
		mappings
	};
}

function recursiveBuildMappings(directoryPath, mappings = [], pathPart = "") {
	const files = fs.readdirSync(directoryPath);
	files.forEach(file => {
		const fileInfo = path.join(directoryPath, file);
		// const fileInfo = fs.readdirSync(partPath);
		const newPathPart = fromNextPathToQueryPath(pathPart, file);

		if (fs.statSync(fileInfo).isDirectory()) {
			recursiveBuildMappings(fileInfo, mappings, newPathPart);
		} else {
			const mapping = {
				route: newPathPart,
				page: generatePathFromFile(file, newPathPart)
			};
			// if ()
			mappings.push(mapping);
		}
	});
}

function isUrlPathname(string) {
	return /^\[.*[a-zA-z0-9]\]$/gm.test(string);
}

function fromNextPathToQueryPath(pathPart, file) {
	const cleanedFile = file.replace(".js", "");
	if (isUrlPathname(cleanedFile)) {
		return `${pathPart}/${":" +
			cleanedFile.replace(/\[/gm, "").replace(/\]/gm, "")}`;
	} else {
		return `${pathPart}/${cleanedFile}`;
	}
}

module.exports = {
	getLambdaFiles,
	generateMappingsFromFiles,
	generateMappingsFromPagesFolder
};
