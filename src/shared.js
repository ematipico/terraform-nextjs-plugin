const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

/** @typedef {import('./index').Route} Route */

/**
 *
 * @param {string} fileName
 * @param {string} [pathPart]
 * @returns {string}
 */
function generatePathFromFile(fileName, pathPart) {
	if (fileName.includes("index") && pathPart) {
		const parts = pathPart.split("/");
		return "/" + parts[parts.length - 1].replace(".js", "").replace(":", "").replace(/\[/gm, "").replace(/]/gm, "");
	}
	return "/" + fileName.replace(".js", "").replace(/\[/gm, "").replace(/]/gm, "");
}

/**
 * It returns the files inside a folder
 *
 * @param {string} lambdaPath The Path to the lambdas
 * @returns {Promise<string[]>}
 */
async function getLambdaFiles(lambdaPath) {
	try {
		const readDirectory = promisify(fs.readdir);

		const files = await readDirectory(lambdaPath);

		return files.map((file) => {
			const pathToFile = path.resolve(lambdaPath, file);
			if (fs.existsSync(pathToFile) && !fs.lstatSync(pathToFile).isDirectory()) {
				return file;
			}
			return file;
		});
	} catch (error) {
		return [];
	}
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
			page: path,
		});

		return mappings;
	}, []);

	return {
		prefix: "",
		mappings,
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
		mappings,
	};
}

function recursiveBuildMappings(directoryPath, mappings = [], pathPart = "") {
	// it starts by reading files inside the given folder
	const files = fs.readdirSync(directoryPath);
	files.forEach((file) => {
		const absoluteFilePath = path.join(directoryPath, file);
		const newPathPart = fromNextPathToQueryPath(pathPart, file);
		const hasIndex = directoryContainsIndexFile(absoluteFilePath);
		if (fs.statSync(absoluteFilePath).isDirectory() && !hasIndex) {
			recursiveBuildMappings(absoluteFilePath, mappings, newPathPart);
		} else {
			const mapping = {
				route: newPathPart,
				page: generatePathFromFile(file, newPathPart),
			};
			// if ()
			mappings.push(mapping);
		}
	});
}

function isUrlPathname(string) {
	return /^\[.*[\dA-z]]$/gm.test(string);
}

function fromNextPathToQueryPath(pathPart, file) {
	const cleanedFile = file.replace(".js", "");
	if (isUrlPathname(cleanedFile)) {
		return `${pathPart}/${":" + cleanedFile.replace(/\[/gm, "").replace(/]/gm, "")}`;
	} else {
		return `${pathPart}/${cleanedFile}`;
	}
}

/**
 *
 * @param {string} absoluteFilePath
 */
function directoryContainsIndexFile(absoluteFilePath) {
	if (fs.statSync(absoluteFilePath).isDirectory()) {
		return fs.existsSync(path.resolve(absoluteFilePath, "index.js"));
	}

	return false;
}

module.exports = {
	getLambdaFiles,
	generateMappingsFromFiles,
	generateMappingsFromPagesFolder,
};
