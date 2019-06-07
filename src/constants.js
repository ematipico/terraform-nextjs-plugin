const path = require("path");
module.exports = {
	NEXT_SERVERLESS_PATH: path.resolve(
		process.cwd() + "/build/serverless/pages/"
	),
	BUILD_PATH: path.resolve(process.cwd() + "/build/")
};
