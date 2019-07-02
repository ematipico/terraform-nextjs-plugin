const ValidationError = require("./validationError");

class EmptyConfigurationError extends ValidationError {
	constructor() {
		super();
		this.type = "EmptyConfigurationError";
		this.message = `Empty configuration, cannot proceed.`;
	}
}

module.exports = EmptyConfigurationError;
