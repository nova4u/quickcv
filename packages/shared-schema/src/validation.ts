import * as z from "zod";

export const projectNameSchema = z
	.string()
	.min(1, "Project name is required")
	.max(50, "Project name must be under 50 characters")
	.regex(
		/^[a-zA-Z0-9-]+$/,
		"Project name can only contain letters, numbers, and hyphens",
	);

export const titleSchema = z
	.string()
	.min(1, "Title is required")
	.max(100, "Title must be under 100 characters");

export const vercelTokenSchema = z
	.string()
	.min(1, "Vercel token is required")
	.regex(/^[a-zA-Z0-9_]+$/, "Invalid Vercel token format");

export const analyticsSchema = z.object({
	type: z.enum(["none", "vercel", "google", "umami"]),
	umamiWebsiteId: z.string().optional(),
	googleTrackingId: z.string().optional(),
});
