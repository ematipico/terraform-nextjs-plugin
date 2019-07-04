class ValidationError extends Error {
	constructor() {
		super();
		this.name = "ValidationError";
	}
}

module.exports = ValidationError;
