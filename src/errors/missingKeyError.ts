import ValidationError from "./validationError";

export default class MissingKeyError extends ValidationError {
	key: string;
	constructor(key: string) {
		super();
		this.key = key;
		this.name = "MissingKeyError";
		this.message = `${key} is missing, it must be provided`;
	}
}
