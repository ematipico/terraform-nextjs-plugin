import ValidationError from "./validationError";

export default class EmptyConfigurationError extends ValidationError {
	constructor() {
		super();
		this.name = "EmptyConfigurationError";
		this.message = `Empty configuration, cannot proceed.`;
	}
}
