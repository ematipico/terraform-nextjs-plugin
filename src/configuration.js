/* eslint-disable unicorn/prevent-abbreviations */
const MissingKeyError = require("./errors/missingKeyError");
const ProviderNotSupported = require("./errors/providerNotSupported");
const IncorrectRoutesError = require("./errors/incorretRoutesError");
const EmptyConfigurationError = require("./errors/emptyConfigurationError");
const InvalidMemorySize = require("./errors/invalidMemorySize");
const InvalidTimeout = require("./errors/invalidTimeout");
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
			routes,
		};
	}

	/**
	 *
	 *
	 * @param {GlobalConfiguration=} config
	 * @returns {Boolean|ValidationError[]}
	 */
	static checkConfiguration(config) {
		let errors = [];
		if (!config) {
			errors.push(new EmptyConfigurationError());
			return errors;
		}
		const { gatewayKey, nextAppDir, routes, provider, memorySize, timeout } = config;

		if (!gatewayKey) {
			errors.push(new MissingKeyError("gatewayKey"));
		}
		if (!nextAppDir) {
			errors.push(new MissingKeyError("nextAppDir"));
		}

		if (routes) {
			if (Array.isArray(routes)) {
				const isInvalid = routes.some((r) => Configuration.checkRoutes(r) === false);
				if (isInvalid === true) {
					errors.push(new IncorrectRoutesError());
				}
			} else {
				if (!Configuration.checkRoutes(routes)) {
					errors.push(new IncorrectRoutesError());
				}
			}
		}

		if (!provider) {
			errors.push(new MissingKeyError("provider"));
		}

		if (!Object.keys(PROVIDERS).includes(provider)) {
			errors.push(new ProviderNotSupported(provider));
		}

		if (memorySize) {
			Number.isNaN(Number(memorySize)) && errors.push(new InvalidMemorySize());
		}

		if (timeout) {
			Number.isNaN(Number(timeout)) && errors.push(new InvalidTimeout());
		}

		if (errors.length > 0) {
			return errors;
		}

		return true;
	}

	get getConfiguration() {
		return this.properties;
	}

	static checkRoutes(routes) {
		let valid = true;

		if (typeof routes.prefix === "undefined" || typeof routes.mappings === "undefined") {
			return false;
		}

		if (typeof routes.prefix !== "string") {
			return false;
		}

		valid = routes.mappings.every((mapping) => {
			return mapping.route && mapping.page;
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
		throw new Error(`Missing config file inside the Next.js folder: ${nextConfigFilePath}`);
	}

	getNextAppDir() {
		return this.properties.nextAppDir;
	}

	getNodeVersion() {
		switch (this.properties.nodeVersion) {
			case "8": {
				return "nodejs8.10";
			}
			case "10": {
				return "nodejs10.x";
			}

			case "12": {
				return "nodejs12.x";
			}

			default:
				return "nodejs8.10";
		}
	}

	getMemorySize() {
		return this.properties.memorySize || "1024";
	}

	getTimeout() {
		return this.properties.timeout || "180";
	}

	hasEnvs() {
		return Boolean(this.properties.env);
	}

	getEnvs() {
		return this.properties.env.reduce((result, env) => {
			result[env.key] = env.value;
			return result;
		}, {});
	}
}

module.exports = Configuration;
