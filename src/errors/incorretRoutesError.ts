import ValidationError from "./validationError";

export default class IncorrectRoutesError extends ValidationError {
	constructor() {
		super();
		this.name = "IncorrectRoutesError";
		this.message = `The object containing the routes is not correct`;
	}
}
