const LambdaPermission = require("./lambdaPermission");
const LambdaZip = require("./lambdaZip");
const LambdaProperties = require("./lambdaProperties");
const fs = require("fs");
const path = require("path");

/**
 * @typedef {import('../awsConfig')} AwsConfig
 */

class Lambda {
	/**
	 *
	 * @param {AwsConfig} config
	 * @param options
	 */
	constructor(config, options) {
		this.config = config;
		this.options = options;
		this.properties = new LambdaProperties(this.config, this.options);
		this.zip = new LambdaZip(this.config, this.options);
		this.permisssions = new LambdaPermission(this.config, this.options);
	}

	emitLambdaFile(filename, thePath) {
		const lambdaTemplate = `
const compatLayer = require('./compatLayer.js');
const page = require('./${filename}.original.js');

exports.render = (event, context, callback) => {
	const { req, res } = compatLayer(event, callback);
	page.render(req, res);
}`;

		fs.writeFileSync(path.resolve(thePath, "lambdas", filename, filename + ".js"), lambdaTemplate, {
			encoding: "utf-8"
		});
	}

	generate() {
		const properties = this.properties.generateLambdaProperties();
		const zip = this.zip.generateZipResource();
		const permissions = this.permisssions.generateLambdaPermissions();

		return {
			properties,
			zip,
			permissions
		};
	}
}
module.exports = Lambda;
