import { type TemplateType, templates } from "@quickcv/templates";
import { z } from "zod";
import DeployScreen from "./components/screens/deploy-screen";
import { EducationScreen } from "./components/screens/education-screen";
import { ExperienceScreen } from "./components/screens/experience-screen";
import GeneralScreen from "./components/screens/general-screen";
import { PreviewScreen } from "./components/screens/preview-screen";
import { SocialScreen } from "./components/screens/social-screen";
import ScreenFooter from "./components/ui/footer";

export const FORM_STEPS = [
	"General",
	"Experience",
	"Education",
	"Socials",
	"Review",
	"Deploy",
] as const;

export type FormStep = (typeof FORM_STEPS)[number];

interface TabConfig {
	name: FormStep;
	screen: React.ComponentType;
	footer?: React.FC<{ className?: string }>;
}

const TABS: TabConfig[] = [
	{
		name: "General",
		screen: GeneralScreen,
		footer: ScreenFooter,
	},
	{
		name: "Experience",
		screen: ExperienceScreen,
		footer: ScreenFooter,
	},
	{
		name: "Education",
		screen: EducationScreen,
		footer: ScreenFooter,
	},
	{
		name: "Socials",
		screen: SocialScreen,
		footer: ScreenFooter,
	},
	{
		name: "Review",
		screen: PreviewScreen,
		footer: ScreenFooter,
	},
	{
		name: "Deploy",
		screen: DeployScreen,
		// footer: DeployFooter,
	},
];
export { TABS, type TabConfig };

const projectNameSchema = z
	.string()
	.min(1, "Project name is required")
	.max(50, "Project name must be under 50 characters")
	.regex(
		/^[a-z0-9-]+$/,
		"Project name must contain only lowercase letters, numbers, and hyphens",
	);

const titleSchema = z
	.string()
	.min(1, "Title is required")
	.max(100, "Title must be under 100 characters");

const vercelTokenSchema = z
	.string()
	.optional()
	.refine(
		(token) => !token || token.startsWith("vercel_"),
		"Invalid Vercel token format",
	);

const analyticsSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("none"),
		umamiWebsiteId: z.string().optional(),
		googleTrackingId: z.string().optional(),
	}),
	z.object({
		type: z.literal("vercel"),
		umamiWebsiteId: z.string().optional(),
		googleTrackingId: z.string().optional(),
	}),
	z.object({
		type: z.literal("umami"),
		umamiWebsiteId: z.string().min(1, "Umami Website ID is required"),
		googleTrackingId: z.string().optional(),
	}),
	z.object({
		type: z.literal("google"),
		umamiWebsiteId: z.string().optional(),
		googleTrackingId: z.string().min(1, "Google Tracking ID is required"),
	}),
]);

const templateKeys = Object.keys(templates) as [
	TemplateType,
	...TemplateType[],
];

export const deployFormSchema = z
	.object({
		projectName: projectNameSchema,
		title: titleSchema,
		vercelToken: vercelTokenSchema,
		analytics: analyticsSchema,
		template: z.enum(templateKeys),
	})
	.refine(
		(data) => {
			if (
				data.analytics.type === "umami" &&
				!data.analytics.umamiWebsiteId?.trim()
			) {
				return false;
			}
			if (
				data.analytics.type === "google" &&
				!data.analytics.googleTrackingId?.trim()
			) {
				return false;
			}
			// Vercel analytics doesn't require additional config
			return true;
		},
		{
			message: "Tracking ID is required for the selected analytics provider",
			path: ["analytics"],
		},
	);

export type DeployFormData = z.infer<typeof deployFormSchema>;
