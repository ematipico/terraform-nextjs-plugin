#!/usr/bin/env node
"use strict";

const cosmiconfig = require("cosmiconfig");
const explorer = cosmiconfig("terranext");
const terranext = require("../src");
explorer
	.search()
	.then(result => {
		terranext(result.config);
		// result.config is the parsed configuration object.
		// result.filepath is the path to the config file that was found.
		// result.isEmpty is true if there was nothing to parse in the config file.
	})
	// eslint-disable-next-line no-unused-vars
	.catch(error => {
		// Do something constructive.
	});
