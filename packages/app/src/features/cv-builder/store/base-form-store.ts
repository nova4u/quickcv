import {
	type AnalyticsData,
	defaultFormData,
	type EducationData,
	type ExperienceData,
	type FormData,
	type GeneralInfoData,
	type SocialsData,
} from "@quickcv/shared-schema";

export type {
	AnalyticsData,
	EducationData,
	EducationItem,
	ExperienceData,
	ExperienceItem,
	FormData,
	GeneralInfoData,
	SocialItem,
	SocialsData,
} from "@quickcv/shared-schema";

export interface BaseFormState {
	formData: FormData;
	editMode?: boolean;
	projectName?: string | null;
	updateGeneralInfo: (data: Partial<GeneralInfoData>) => void;
	updateExperience: (data: Partial<ExperienceData>) => void;
	updateEducation: (data: Partial<EducationData>) => void;
	updateSocials: (data: Partial<SocialsData>) => void;
	updateAnalytics: (data: Partial<AnalyticsData>) => void;
	updateTemplate: (template: string) => void;
	setFormData: (data: FormData) => void;
	reset: () => void;
}

type FormSection = keyof FormData;
type SetFunction = (
	partial:
		| BaseFormState
		| Partial<BaseFormState>
		| ((state: BaseFormState) => BaseFormState | Partial<BaseFormState>),
) => void;

function createSectionUpdater<T extends Record<string, unknown>>(
	section: FormSection,
	set: SetFunction,
) {
	return (data: Partial<T>) => {
		set((state: BaseFormState) => ({
			formData: {
				...state.formData,
				[section]: { ...(state.formData[section] as unknown as T), ...data },
			},
		}));
	};
}

interface FormStoreCreatorOptions {
	initialData?: FormData;
	editMode?: boolean;
	projectName?: string | null;
}

export function formStoreCreator(
	set: SetFunction,
	options: FormStoreCreatorOptions = {},
): BaseFormState {
	const { initialData = defaultFormData, editMode, projectName } = options;

	return {
		// State
		formData: initialData,
		editMode,
		projectName,

		// Actions
		setFormData: (data: FormData) => {
			set({ formData: data });
		},

		updateGeneralInfo: createSectionUpdater<GeneralInfoData>(
			"generalInfo",
			set,
		),
		updateExperience: createSectionUpdater<ExperienceData>("experience", set),
		updateEducation: createSectionUpdater<EducationData>("education", set),
		updateSocials: createSectionUpdater<SocialsData>("socials", set),
		updateAnalytics: createSectionUpdater<AnalyticsData>("analytics", set),
		updateTemplate: (template: string) => {
			set((state: BaseFormState) => ({
				formData: {
					...state.formData,
					template,
				},
			}));
		},

		reset: () => {
			set({
				formData: initialData,
			});
		},
	};
}
