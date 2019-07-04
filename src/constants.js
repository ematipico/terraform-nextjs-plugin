const path = require("path");
const PROVIDERS = {
	AWS: "AWS"
};

const FILE_NAMES = {
	LAMBDAS: "lambdas.terraform.tf.json",
	GATEWAY: "gateway.terraform.tf.json"
};

const COMPAT_LAYER_PATH = path.resolve(__dirname);

module.exports = {
	PROVIDERS,
	COMPAT_LAYER_PATH,
	FILE_NAMES
};
