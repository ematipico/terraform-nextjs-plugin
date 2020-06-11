const path = require("path");

const PROVIDERS = {
	AWS: "AWS",
};

const FILE_NAMES = {
	LAMBDAS: "lambdas.terraform.tf.json",
	GATEWAY: "gateway.terraform.tf.json",
};

const NEXT_CONFIG = "next.config.js";
const COMPAT_LAYER_PATH = path.resolve(__dirname);

module.exports = {
	PROVIDERS,
	FILE_NAMES,
	NEXT_CONFIG,
	COMPAT_LAYER_PATH,
};
