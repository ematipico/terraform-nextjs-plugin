class IncorrectRoutesError extends Error {
	constructor() {
		super();
		this.name = "IncorrectRoutesError";
		this.message = `The object containing the routes is not correct`;
	}
}

module.exports = {
	IncorrectRoutesError
};
