const ValidationError = require("./validationError");

class MissingKeyError extends ValidationError {
	constructor(key) {
		super();
		this.key = key;
		this.type = "MissingKeyError";
		this.message = `${key} is missing, it must be provided`;
	}
}

module.exports = MissingKeyError;
