/* eslint-disable unicorn/prevent-abbreviations */
const MissingKeyError = require("./errors/missingKeyError");
const ProviderNotSupported = require("./errors/providerNotSupported");
const IncorrectRoutesError = require("./errors/incorretRoutesError");
const EmptyConfigurationError = require("./errors/emptyConfigurationError");
const { PROVIDERS, NEXT_CONFIG } = require("./constants");
const path = require("path");
const fs = require("fs");

/**
 * @typedef {import('./errors/errors').ValidationError} ValidationError
 * @typedef {import('./index').Route} Route
 * @typedef {import('./index').Configuration} GlobalConfiguration
 */

class Configuration {
	/**
	 *
	 * @param {GlobalConfiguration} config
	 */
	constructor(config) {
		Configuration.checkConfiguration(config);
		const { gatewayKey, nextAppDir, routes, provider, buildPath } = config;
		this.properties = {
			...config,
			gatewayKey: gatewayKey || "Terranext",
			buildPath: buildPath || ".next",
			provider,
			nextAppDir: nextAppDir ? path.resolve(process.cwd(), nextAppDir) : "./",
			routes
		};
	}

	/**
	 *
	 *
	 * @param {GlobalConfiguration} config
	 * @returns {Boolean|ValidationError[]}
	 */
	static checkConfiguration(config) {
		let errors = [];
		if (!config) {
			errors.push(new EmptyConfigurationError());
			return errors;
		}
		const { gatewayKey, nextAppDir, routes, provider } = config;

		if (!gatewayKey) errors.push(new MissingKeyError("gatewayKey"));
		if (!nextAppDir) errors.push(new MissingKeyError("nextAppDir"));

		if (routes) {
			if (Array.isArray(routes)) {
				const isInvalid = routes.some(r => Configuration.checkRoutes(r) === false);
				if (isInvalid === true) errors.push(new IncorrectRoutesError());
			} else {
				if (!Configuration.checkRoutes(routes)) errors.push(new IncorrectRoutesError());
			}
		}

		if (!provider) errors.push(new MissingKeyError("provider"));

		if (!Object.keys(PROVIDERS).includes(provider)) {
			errors.push(new ProviderNotSupported(provider));
		}

		if (errors.length > 0) return errors;

		return true;
	}

	get getConfiguration() {
		return this.properties;
	}

	static checkRoutes(routes) {
		let valid = true;

		if (typeof routes.prefix === "undefined" || typeof routes.mappings === "undefined") return false;

		if (typeof routes.prefix !== "string") return false;

		valid = routes.mappings.every(mapping => {
			return !!mapping.route && !!mapping.page;
		});

		return valid;
	}

	/**
	 * @returns {string}
	 */
	getLambdaPath() {
		return path.resolve(this.properties.nextAppDir, this.properties.buildPath, "lambdas");
	}

	/**
	 * @returns {string}
	 */
	getServerlessPagesPath() {
		return path.resolve(this.properties.nextAppDir, this.properties.buildPath, "serverless", "pages");
	}

	/**
	 * @returns {string}
	 */
	getGatewayKey() {
		return this.properties.gatewayKey;
	}

	/**
	 *
	 * @returns {Route[]}
	 */
	getRoutes() {
		if (Array.isArray(this.properties.routes)) {
			return this.properties.routes;
		}
		return [this.properties.routes];
	}

	/**
	 * @returns {string}
	 */
	getBuildPath() {
		return path.resolve(process.cwd(), this.properties.buildPath);
	}

	/**
	 *
	 * @returns {string}
	 */
	getServerlessBuildPath() {
		return path.resolve(process.cwd(), this.properties.buildPath, "serverless/pages");
	}

	/**
	 *
	 * @returns {any}
	 */
	getNextConfig() {
		const nextConfigFilePath = path.resolve(this.properties.nextAppDir, NEXT_CONFIG);
		if (fs.existsSync(nextConfigFilePath)) {
			return require(nextConfigFilePath);
		}
		throw new Error("Missing config file inside the Next.js folder: " + nextConfigFilePath);
	}

	getNextAppDir() {
		return this.properties.nextAppDir;
	}
}

module.exports = Configuration;
