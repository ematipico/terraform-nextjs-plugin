export default class FolderNotFoundError extends Error {
	constructor(folderName, error) {
		super();
		this.name = "FolderNotFoundError";
		this.message = `${folderName} doesn't exist`;
		this.stack = error.stack;
	}
}

