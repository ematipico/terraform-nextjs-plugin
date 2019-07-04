class FolderNotFoundError extends Error {
	constructor(folderName) {
		super();
		this.name = "FolderNotFoundError";
		this.message = `${folderName} doesn't exist`;
	}
}

module.exports = FolderNotFoundError;
