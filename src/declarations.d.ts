import { AWS } from ".";

export interface Param {
	name: string;
}

export interface LambdaResource {
	resourceUniqueId: string;
	resource: AWS.Function;
	permissionUniqueId: string;
	permission: AWS.Permission;
}
