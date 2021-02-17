const generateResources = require("../../lib");
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
