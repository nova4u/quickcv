export const config = {
	// Service identification
	serviceName: "simple-vercel-publisher",
	serviceDisplayName: "Simple Vercel Publisher",
	version: "1.0.0",

	// Project naming
	projectPrefix: "svp",

	// Metadata
	metadataScriptId: "svp-metadata",

	// Vercel API
	vercelApiVersion: "v13",

	// Deployment settings
	defaultFramework: null,
	defaultTarget: "production" as const,
} as const;

export type Config = typeof config;
