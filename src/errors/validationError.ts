export default class ValidationError extends Error {
	constructor() {
		super();
		this.name = "ValidationError";
	}
}
