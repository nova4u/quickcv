import type { RadioOption } from "@/components/form/form-item";

export const ANALYTICS_OPTIONS: RadioOption[] = [
	{ value: "none", label: "No Analytics" },
	{ value: "vercel", label: "Vercel Analytics" },
	{ value: "google", label: "Google Analytics" },
	{ value: "umami", label: "Umami Analytics" },
];

export const ANALYTICS_HELP_TEXT = {
	google: {
		description:
			"Find this in your Google Analytics dashboard under Admin → Data Streams (for GA4) or Admin → Property Settings (for Universal Analytics)",
		privacy:
			"Google Analytics will track page views and user interactions. Make sure you comply with privacy regulations in your region.",
		adminUrl: "https://analytics.google.com/",
	},
	umami: {
		description: "Find this in your Umami dashboard under Settings → Websites",
		dashboardUrl: "https://cloud.umami.is/settings/websites",
	},
	vercel: {
		description:
			"Vercel Analytics will be automatically enabled for your deployment. You can view analytics in your Vercel dashboard.",
	},
} as const;