const generateResources = require("../../src");
const routes = require("./routes");
generateResources(
	{
		gatewayKey: "CustomKey",
		nextAppDir: "../app/",
		provider: "AWS",
		routes,
		env: [
			{
				key: "DEBUG",
				value: "express:*"
			}
		]
	},
	true
);
