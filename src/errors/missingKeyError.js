class MissingKeyError extends Error {
	constructor(key) {
		super();
		this.key = key;
		this.name = "MissingKeyError";
		this.message = `${key} is missing, it must be provided`;
	}
}

module.exports = {
	MissingKeyError
};
