export type {
	Deployment,
	DeploymentConfig,
	DeploymentProvider,
	DeploymentResult,
	ValidationResult,
} from "./deployment-provider";
export { deploymentConfigSchema } from "./deployment-provider";

import type { DeploymentProvider } from "./deployment-provider";
import { vercelProvider } from "./providers";

export const deploymentProviders = {
	vercel: vercelProvider,
} as const satisfies Record<string, DeploymentProvider>;

export type DeploymentProviderKey = keyof typeof deploymentProviders;

export { vercelProvider } from "./providers";
