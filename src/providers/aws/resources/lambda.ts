import AwsConfig from "../awsConfig";
import LambdaProperties from "./lambdaProperties";
import LambdaZip from "./lambdaZip";
import LambdaPermission from "./lambdaPermission";
const fs = require("fs");
const path = require("path");

export interface LambdaOptions {
	id: string
	directoryName: string
}

export default class Lambda {

	readonly config: AwsConfig;
	readonly options: LambdaOptions;
	readonly properties: LambdaProperties;
	readonly zip: LambdaZip;
	readonly permissions: LambdaPermission;

	constructor(config: AwsConfig, options: LambdaOptions) {
		this.config = config;
		this.options = options;
		this.properties = new LambdaProperties(this.config, this.options);
		this.zip = new LambdaZip(this.config, this.options);
		this.permissions = new LambdaPermission(this.config, this.options);
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
			encoding: "utf-8",
		});
	}

	generate() {
		const properties = this.properties.generateLambdaProperties();
		const zip = this.zip.generateZipResource();
		const permissions = this.permissions.generateLambdaPermissions();

		return {
			properties,
			zip,
			permissions,
		};
	}
}
