// eslint-disable-next-line node/no-unpublished-require
const generateResources = require("../../src");
const routes = require("./routes");
generateResources(
	{
		gatewayKey: "CustomKey",
		lambdaPath: "../app/",
		routes
	},
	true
);
