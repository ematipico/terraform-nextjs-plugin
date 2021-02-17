import AwsConfig from "./providers/aws/awsConfig";
import AwsResources, { AllLambdas, GatewayResources } from "./providers/aws";

const { cosmiconfig } = require("cosmiconfig");
const build = require("next/dist/build").default;

export type TerranextValidLambdas = | AllLambdas;
export type TerranextValidGateways = | GatewayResources;

export interface Terranext {
	gateway: TerranextValidGateways;
	lambdas: TerranextValidLambdas;
}

export default async function terranext(
	configuration,
	write = false
): Promise<void | Terranext> {
	try {
		const fileConfiguration = await retrieveConfiguration();
		const finalConfiguration = {
			...fileConfiguration,
			...configuration,
		};
		// TODO: refactor generation and make it more abstract
		const config = new AwsConfig(finalConfiguration);
		const nextConfig = config.getNextConfig();
		nextConfig.target = "serverless";
		await build(config.getNextAppDir(), nextConfig);
		const aws = new AwsResources(config);

		if (write === true) {
			await aws.generateGatewayResources(write);
			await aws.generateLambdaResources(write);
		} else {
			const lambdas = await aws.generateLambdaResources();
			const gateway = await aws.generateGatewayResources();
			return {
				gateway,
				lambdas,
			};
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		process.exit(1);
	}
}

async function retrieveConfiguration() {
	const explorer = cosmiconfig("terranext");
	try {
		const result = await explorer.search();
		return result.config;
	} catch {
		return;
	}
}
