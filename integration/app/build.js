const generateResources = require("../../src");
const routes = require("./routes");
generateResources(
	{
		gatewayKey: "CustomKey",
		nextAppDir: "../app/",
		provider: "AWS",
		routes
	},
	true
);
