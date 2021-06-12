const ValidationError = require("./validationError");

class InvalidMemorySize extends ValidationError {
	constructor() {
		super();
		this.type = "InvalidMemorySize";
		this.message = "memorySize value is invalid, if it is provided, it must be a string containing a number between 128 and 10240";
	}
}

module.exports = InvalidMemorySize;
