const path = require("path");
const PROVIDERS = {
	AWS: "AWS"
};

const COMPAT_LAYER_PATH = path.resolve(__dirname);

module.exports = {
	PROVIDERS,
	COMPAT_LAYER_PATH
};
