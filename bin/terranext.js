#!/usr/bin/env node

const { cosmiconfig } = require("cosmiconfig");
const meow = require("meow");
const generateResources = require("../src");

const explorer = cosmiconfig("terranext");

const cli = meow(
	`
Usage
	$ terranext

Options
	--gateway-key, -g   The API Gateway key of the project. Default is "Terranext"
	--next-app-dir, -d  The path that Terraform CLI has to follow to reach the nextjs project.
	--provider          The Cloud provider to use when exporting the configuration
	--env               A way for passing environment variables to the lambdas
		
Examples
	$ terranext 
	$ terranext --gateway-key=CustomKey --next-app-dir=../../nextjs-project/
	$ terranext --provider=AWS --next-app-dir=../../nextjs-project/
	$ terranext -g=CustomKey -d=../../nextjs-project/
	$ terranext --env="DEBUG,express:*" --env="API_KEY,1234"
`,
	{
		flags: {
			gatewayKey: {
				type: "string",
				default: "Terranext",
				alias: "g",
			},
			// eslint-disable-next-line unicorn/prevent-abbreviations
			nextAppDir: {
				type: "string",
				alias: "d",
				default: "./",
			},
			provider: {
				type: "string",
			},
			env: {
				type: "string",
				isMultiple: true,
			},
		},
	}
);

explorer
	.search()
	.then(async (result) => {
		const { gatewayKey, nextAppDir, provider, env } = cli.flags;
		let parsedEnvs;
		if (env) {
			parsedEnvs = parseEnv(env, {});
		}
		const options = {
			...result.config,
			gatewayKey,
			nextAppDir,
			provider,
			env: parsedEnvs,
		};
		await generateResources(options, true);
	})
	.catch((error) => {
		// eslint-disable-next-line no-console
		console.error(error);
		process.exit(1);
		// Do something constructive.
	});

function parseEnv(unparsedEnv) {
	if (Array.isArray(unparsedEnv)) {
		return unparsedEnv.map((env) => {
			const splitEnv = env.split(",");
			return {
				key: splitEnv[0],
				value: splitEnv[1],
			};
		});
	}

	const splitEnv = unparsedEnv.split(",");

	return [
		{
			key: splitEnv[0],
			value: splitEnv[1],
		},
	];
}
