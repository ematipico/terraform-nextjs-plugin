import { PROVIDERS } from "../constants";
import ValidationError from "./validationError";

export default class ProviderNotSupported extends ValidationError {
	provider: string;

	constructor(provider: string) {
		super();
		this.provider = provider;
		this.name = "ProviderNotSupported";
		this.message = `${provider} provider is not supported. Choose between: ${Object.keys(PROVIDERS).join(", ")}`;
	}
}
