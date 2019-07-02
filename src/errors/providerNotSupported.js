const { PROVIDERS } = require("../constants");
const ValidationError = require("./validationError");

class ProviderNotSupported extends ValidationError {
	constructor(provider) {
		super();
		this.provider = provider;
		this.type = "ProviderNotSupported";
		this.message = `${provider} provider is not supported. Choose between: ${Object.keys(PROVIDERS).join(", ")}`;
	}
}

module.exports = ProviderNotSupported;
