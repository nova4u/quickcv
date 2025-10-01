import type { DeploymentConfig } from "@/services/deployment";
import type { DeployFormData } from "../config";

interface BuildDeploymentConfigOptions {
	formData: DeployFormData;
	files: Record<string, string | { data: string; encoding: string }>;
}

/**
 * Builds deployment configuration object from form data and files
 */
export async function buildDeploymentConfig({
	formData,
	files,
}: BuildDeploymentConfigOptions): Promise<DeploymentConfig> {
	return {
		name: formData.projectName,
		files,
		environmentVariables: {
			...(formData.analytics.type === "google" && {
				GOOGLE_ANALYTICS_ID: formData.analytics.googleTrackingId || "",
			}),
			...(formData.analytics.type === "umami" && {
				UMAMI_WEBSITE_ID: formData.analytics.umamiWebsiteId || "",
			}),
		},
	};
}
