const ValidationError = require("./validationError");

class InvalidTimeout extends ValidationError {
	constructor() {
		super();
		this.type = "InvalidTimeout";
		this.message = "timeout value is invalid, if it is provided, it must be a string containing a number smaller than 900";
	}
}

module.exports = InvalidTimeout;
