#!/usr/bin/env node
"use strict";

const cosmiconfig = require("cosmiconfig");
const explorer = cosmiconfig("terranext");

explorer
	.search()
	.then(result => {
		const {
			setConfiguration,
			checkConfiguration
		} = require("../src/configuration");
		checkConfiguration(result.config);
		setConfiguration(result.config);

		// result.config is the parsed configuration object.
		// result.filepath is the path to the config file that was found.
		// result.isEmpty is true if there was nothing to parse in the config file.

		generateTerraformConfiguration();
	})
	.catch(error => {
		// Do something constructive.
	});
