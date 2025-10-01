import { z } from "zod";

export const apiKeySchema = z.object({
	vercelApiKey: z
		.string()
		.min(1, "Vercel API key is required")
		.min(20, "Vercel API key must be at least 20 characters")
		.regex(/^[a-zA-Z0-9_-]+$/, "Invalid API key format"),
});

export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
