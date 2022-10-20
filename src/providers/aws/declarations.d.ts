import { AWS } from "./aws.declarations";

export interface Param {
	name: string;
	mandatory?: boolean;
}

export interface AwsGatewayOptions {
	parentId?: string;
	id: string;
	isUrlParameter?: boolean;
	pathname: string;
	params?: Param[];
	queryStringParams?: Param[];
	lambdaName: string;
}

export interface GenerateLambdaResource {
	resourceUniqueId: string;
	resource: AWS.Function;
}

export interface LambdaPermission {
	permissionUniqueId: string;
	resource: AWS.Permission;
}

export interface GenerateGatewayResource {
	uniqueId: string;
	resource: AWS.GatewayResource;
}

export interface HandleResource {
	pathPart: string;
	index: number;
	parts: string[];
	pathname: string;
	lambdaName: string;
	params: Param[];
}

export interface GenerateGatewayResourcePayload {
	id: string;
	pathname: string;
	parentId?: string;
	isUrlParam?: boolean;
}

export interface GenerateGatewayIntegrationPayload {
	id: string;
	gatewayResourceId: string;
	lambdaName: string;
	params?: Param[];
	queryStringParams?: Param[];
}

export interface GenerateGatewayMethodPayload {
	uniqueName: string;
	gatewayResourceId: string;
	params?: Param[];
	queryStringParams?: Param[];
}

export interface LambdaOptions {
	id: string;
	directoryName: string;
}
