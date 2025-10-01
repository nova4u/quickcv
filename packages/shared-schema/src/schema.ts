import * as z from "zod";
import {
	defaultRichTextContent,
	type RichTextContent,
	richTextToPlainText,
} from "./rich-text-types";
import { analyticsSchema as baseAnalyticsSchema } from "./validation";

export interface SchemaUIMetadata {
	widget:
		| "text"
		| "email"
		| "password"
		| "number"
		| "richtext"
		| "textarea"
		| "checkbox"
		| "radio"
		| "daterange"
		| "link"
		| "imageUploader";
	showLabel?: boolean;
	label?: string;
	placeholder?: string;
	checkboxLabel?: string;
	customErrorHandling?: boolean;
	layout?: {
		group?: string;
		groupType?: "row" | "col";
		span?: number;
	};
}

export interface FormFieldConfig extends Omit<SchemaUIMetadata, "widget"> {
	// Required properties
	name: string;
	type: SchemaUIMetadata["widget"];
	// Optional base properties
	className?: string;
	id?: string;
	required?: boolean;
}

// NOTE: This is a workaround for Zod's describe() method which only accepts strings.
// We want type-safe metadata but don't want to stringify/parse JSON.
// This cast maintains type safety at compile time while satisfying Zod's runtime requirements.
const createUIMetadata = (description: SchemaUIMetadata) => {
	return description as unknown as string;
};

const dateSchema = (name: string) =>
	z
		.string()
		.min(1, `${name} is required`)
		.regex(/^\d{4}-\d{2}$/, `${name} must be in YYYY-MM format`);

const urlSchema = z.string().url("Must be a valid URL").or(z.literal(""));

const richTextSchema = z.custom<RichTextContent>(
	(data) => {
		if (!Array.isArray(data)) return false;
		const plainText = richTextToPlainText(data);
		return (
			plainText.length === 0 ||
			(plainText.length >= 10 && plainText.length <= 1000)
		);
	},
	{
		message: "Description must be between 10 and 500 characters",
	},
);

export const generalInfoSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.max(100, "Full name must be under 100 characters"),
	professionalTitle: z
		.string()
		.min(1, "Professional title is required")
		.max(100, "Professional title must be under 100 characters"),
	website: urlSchema.optional().describe(
		createUIMetadata({
			label: "Website",
			placeholder: "acme.com",
			widget: "link",
		}),
	),
	about: richTextSchema.optional(),
	photo: z.string().nullable().optional(), // Base64 encoded image data
});

export const experienceItemSchema = z.object({
	company: z
		.string()
		.min(1, "Company name is required")
		.max(100, "Company name must be under 100 characters")
		.describe(
			createUIMetadata({
				label: "Company",
				placeholder: "Acme",
				widget: "text",
				layout: { group: "1", groupType: "row" },
			}),
		),
	position: z
		.string()
		.min(1, "Position is required")
		.max(100, "Position must be under 100 characters")
		.describe(
			createUIMetadata({
				label: "Job Title",
				placeholder: "Frontend Developer",
				widget: "text",
			}),
		),
	website: urlSchema.describe(
		createUIMetadata({
			label: "Website",
			placeholder: "acme.com",
			widget: "link",
			layout: { group: "1", groupType: "row" },
		}),
	),
	dates: z
		.discriminatedUnion("current", [
			z.object({
				current: z.literal(true),
				startDate: dateSchema("Start Date"),
			}),
			z.object({
				current: z.literal(false),
				startDate: dateSchema("Start Date"),
				endDate: dateSchema("End Date"),
			}),
		])
		.describe(
			createUIMetadata({
				widget: "daterange",
				checkboxLabel: "I currently work here",
				showLabel: false,
				customErrorHandling: true,
			}),
		),
	location: z
		.string()
		.min(1, "Location is required")
		.max(100, "Location must be under 100 characters")
		.describe(
			createUIMetadata({
				label: "Location",
				placeholder: "New York, USA",
				widget: "text",
			}),
		),
	description: richTextSchema.optional().describe(
		createUIMetadata({
			label: "Description",
			placeholder:
				"Lead developer for a No-Code Web Application Builder platform...",
			widget: "richtext",
		}),
	),
});

export const experienceDataSchema = z.object({
	experiences: z
		.array(experienceItemSchema)
		.max(10, "Maximum 10 work experiences allowed"),
});

export const educationItemSchema = z.object({
	institution: z
		.string()
		.min(1, "Institution name is required")
		.max(100, "Institution name must be under 100 characters")
		.describe(
			createUIMetadata({
				label: "Institution",
				placeholder: "Harvard University",
				widget: "text",
			}),
		),
	degree: z
		.string()
		.min(1, "Degree is required")
		.max(100, "Degree must be under 100 characters")
		.describe(
			createUIMetadata({
				label: "Degree",
				placeholder: "Bachelor of Science",
				widget: "text",
			}),
		),
	location: z
		.string()
		.min(1, "Location is required")
		.max(100, "Location must be under 100 characters")
		.describe(
			createUIMetadata({
				label: "Location",
				placeholder: "Cambridge, MA",
				widget: "text",
			}),
		),
	dates: z
		.discriminatedUnion("current", [
			z.object({
				current: z.literal(true),
				startDate: dateSchema("Start Date"),
			}),
			z.object({
				current: z.literal(false),
				startDate: dateSchema("Start Date"),
				endDate: dateSchema("End Date"),
			}),
		])
		.describe(
			createUIMetadata({
				widget: "daterange",
				checkboxLabel: "I currently study here",
				showLabel: false,
				customErrorHandling: true,
			}),
		),
	description: richTextSchema.optional().describe(
		createUIMetadata({
			label: "Description",
			placeholder:
				"Studied computer science with focus on software engineering...",
			widget: "richtext",
		}),
	),
});

export const educationDataSchema = z.object({
	education: z
		.array(educationItemSchema)
		.max(5, "Maximum 5 education entries allowed"),
});

export const socialItemSchema = z.object({
	id: z.string().min(1, "ID is required"),
	name: z
		.string()
		.min(1, "Platform name is required")
		.max(50, "Platform name must be under 50 characters"),
	url: z.string().url("Must be a valid URL"),
});

export const socialsDataSchema = z.object({
	socials: z.array(socialItemSchema).max(15, "Maximum 15 social links allowed"),
});

export const formDataSchema = z.object({
	generalInfo: generalInfoSchema,
	experience: experienceDataSchema,
	education: educationDataSchema,
	socials: socialsDataSchema,
	analytics: baseAnalyticsSchema,
	template: z
		.string()
		.min(1, "Template is required")
		.regex(/^[a-z-]+$/, "Template key must be lowercase letters and hyphens"),
});

export type GeneralInfoData = z.infer<typeof generalInfoSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ExperienceData = z.infer<typeof experienceDataSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type EducationData = z.infer<typeof educationDataSchema>;
export type SocialItem = z.infer<typeof socialItemSchema>;
export type SocialsData = z.infer<typeof socialsDataSchema>;
export type FormData = z.infer<typeof formDataSchema>;
export type AnalyticsData = z.infer<typeof baseAnalyticsSchema>;

export const defaultGeneralInfo: GeneralInfoData = {
	fullName: "",
	professionalTitle: "",
	about: defaultRichTextContent,
	photo: undefined,
};

export const defaultExperienceItem: ExperienceItem = {
	company: "",
	position: "",
	website: "",
	location: "",
	dates: { current: false, startDate: "", endDate: "" },
	description: undefined,
};

export const defaultEducationItem: EducationItem = {
	institution: "",
	degree: "",
	location: "",
	dates: { current: false, startDate: "", endDate: "" },
	description: undefined,
};

export const defaultSocialItem: SocialItem = {
	id: "",
	name: "",
	url: "",
};

export const defaultFormData: FormData = {
	generalInfo: defaultGeneralInfo,
	experience: {
		experiences: [],
	},
	education: {
		education: [],
	},
	socials: {
		socials: [],
	},
	analytics: { type: "none" },
	template: "minimal",
};
