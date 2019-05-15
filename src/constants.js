const path = require("path");
module.exports = {
	NEXT_BUILD_PATH: path.resolve(process.cwd() + "/build/serverless/pages/"),
	BGE_BUILD_PATH: path.resolve(process.cwd() + "/build/")
};
