const ValidationError = require("./validationError");

class IncorrectRoutesError extends ValidationError {
	constructor() {
		super();
		this.type = "IncorrectRoutesError";
		this.message = `The object containing the routes is not correct`;
	}
}

module.exports = IncorrectRoutesError;
