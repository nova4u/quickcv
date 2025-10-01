import {
	type AnalyticsData,
	defaultFormData,
	type EducationData,
	type ExperienceData,
	type FormData,
	type GeneralInfoData,
	type SocialsData,
} from "@quickcv/shared-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FORM_STEPS, type FormStep } from "../config";

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
export { FORM_STEPS, type FormStep };

interface FormState {
	formData: FormData;
	editMode: boolean;
	projectName: string | null;
	updateGeneralInfo: (data: Partial<GeneralInfoData>) => void;
	updateExperience: (data: Partial<ExperienceData>) => void;
	updateEducation: (data: Partial<EducationData>) => void;
	updateSocials: (data: Partial<SocialsData>) => void;
	updateAnalytics: (data: Partial<AnalyticsData>) => void;
	updateTemplate: (template: string) => void;
	setFormData: (data: FormData) => void;
	setEditMode: (
		editMode: boolean,
		projectName?: string,
		deploymentUrl?: string,
	) => void;
	reset: () => void;
}

const initialFormData = defaultFormData;

export const useFormStore = create<FormState>()(
	persist(
		(set) => ({
			formData: initialFormData,
			editMode: false,
			projectName: null,

			setFormData: (data: FormData) => {
				set({ formData: data });
			},
			setEditMode: (editMode: boolean, projectName?: string) => {
				set({ editMode, projectName: projectName || null });
			},
			updateGeneralInfo: (data: Partial<GeneralInfoData> | GeneralInfoData) => {
				set((state) => {
					return {
						formData: {
							...state.formData,
							generalInfo: { ...state.formData.generalInfo, ...data },
						},
					};
				});
			},

			updateExperience: (data: Partial<ExperienceData>) => {
				set((state) => ({
					formData: {
						...state.formData,
						experience: { ...state.formData.experience, ...data },
					},
				}));
			},

			updateEducation: (data: Partial<EducationData>) => {
				set((state) => ({
					formData: {
						...state.formData,
						education: { ...state.formData.education, ...data },
					},
				}));
			},

			updateSocials: (data: Partial<SocialsData>) => {
				set((state) => ({
					formData: {
						...state.formData,
						socials: { ...state.formData.socials, ...data },
					},
				}));
			},

			updateAnalytics: (data: Partial<AnalyticsData>) => {
				set((state) => ({
					formData: {
						...state.formData,
						analytics: { ...state.formData.analytics, ...data },
					},
				}));
			},

			updateTemplate: (template: string) => {
				set((state) => ({
					formData: {
						...state.formData,
						template,
					},
				}));
			},

			reset: () => {
				set({
					formData: initialFormData,
					editMode: false,
					projectName: null,
				});
			},
		}),
		{
			name: "portfolio-form-storage",
		},
	),
);
