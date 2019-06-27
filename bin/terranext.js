#!/usr/bin/env node
"use strict";

const cosmiconfig = require("cosmiconfig");
const meow = require("meow");
const generateResources = require("../src");

const explorer = cosmiconfig("terranext");

const cli = meow(
	`
	Usage
	  $ terranext

	Options
	  --gatewayKey, -g  The API Gateway key of the project. Default is "Terranext"
		--lambdaPath, -p  The path that Terraform CLI has to follow to reach the nextjs project.
		--write		
		--provider				The Cloud provider to use when exporting the configuration
		
	Examples
	  $ terranext 
	  $ terranext --gatewayKey=CustomKey --lambdaPath=../../nextjs-project/
	  $ terranext --provider=AWS
	  $ terranext -g=CustomKey -p=../../nextjs-project/
`,
	{
		flags: {
			gatewayKey: {
				type: "string",
				default: "Terranext",
				alias: "g"
			},
			lambdaPath: {
				type: "string",
				alias: "p",
				default: "./"
			},
			provider: {
				type: "string"
			}
		}
	}
);

explorer
	.search()
	.then(result => {
		const { gatewayKey, lambdaPath, provider } = cli.flags;
		const options = {
			...result.config,
			gatewayKey,
			lambdaPath,
			provider
		};

		generateResources(options, true);
	})
	.catch(error => {
		// eslint-disable-next-line no-console
		console.error(error);
		process.exit(1);
		// Do something constructive.
	});
