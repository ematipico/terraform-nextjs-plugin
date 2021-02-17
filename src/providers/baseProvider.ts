import Configuration from "../configuration";

export class BaseProvider<ConfigurationType> {
	protected config: ConfigurationType
	constructor(config: ConfigurationType) {
		this.config = config;
	}
}

