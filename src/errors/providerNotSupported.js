const { PROVIDERS } = require("../constants");

class ProviderNotSupported extends Error {
	constructor(provider) {
		super();
		this.provider = provider;
		this.name = "ProviderNotSupported";
		this.message = `${provider} provider is not supported. Choose between: ${Object.keys(PROVIDERS).join(", ")}`;
	}
}

module.exports = {
	ProviderNotSupported
};
