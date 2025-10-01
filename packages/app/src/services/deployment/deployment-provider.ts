import { type FormData, formDataSchema } from "@quickcv/shared-schema";
import { z } from "zod";

export interface DeploymentProvider {
	name: string;
	validateApiKey: (apiKey: string) => Promise<ValidationResult>;
	listDeployments: (apiKey: string, prefix?: string) => Promise<Deployment[]>;
	waitForDeploymentReady: (
		apiKey: string,
		deploymentId: string,
	) => Promise<void>;
	createDeployment: (
		apiKey: string,
		config: DeploymentConfig,
	) => Promise<DeploymentResult>;
	getCvData: (apiKey: string, projectName: string) => Promise<FormData | null>;
}

export interface ValidationResult {
	isValid: boolean;
	error?: string;
	userInfo?: {
		username: string;
		email?: string;
		name?: string;
		avatar?: string;
	};
}

export interface Deployment {
	id: string;
	name: string;
	url: string;
	status: "building" | "ready" | "error" | "canceled";
	domain?: string;
	productionDomain?: string;
	createdAt: Date;
	updatedAt: Date;
	settingsUrl?: string;
}

export const deploymentConfigSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.regex(
			/^[a-z0-9-]+$/,
			"Name must containly lowercase letters, numbers, and hyphens",
		),
	files: z.record(
		z.union([z.string(), z.object({ data: z.string(), encoding: z.string() })]),
	),
	environmentVariables: z.record(z.string()).optional(),
	buildCommand: z.string().optional(),
	outputDirectory: z.string().optional(),
	meta: formDataSchema.optional(),
});

export type DeploymentConfig = z.infer<typeof deploymentConfigSchema>;

export interface DeploymentResult {
	success: boolean;
	deployment?: Deployment;
	error?: string;
}
