import type { FormData } from "@quickcv/shared-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BaseFormState, formStoreCreator } from "./base-form-store";

export const createPersistedFormStore = (name?: string) =>
	create<BaseFormState>()(
		persist(
			(set) =>
				formStoreCreator(set, {
					editMode: undefined,
					projectName: undefined,
				}),
			{
				name: name || "quickcv-create-form-storage",
			},
		),
	);

export function createFormStore(initialData?: FormData, projectName?: string) {
	return create<BaseFormState>()((set) =>
		formStoreCreator(set, {
			initialData,
			editMode: true,
			projectName: projectName || null,
		}),
	);
}
