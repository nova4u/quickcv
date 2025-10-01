import { zodResolver } from "@hookform/resolvers/zod";
import {
	educationDataSchema,
	experienceDataSchema,
	generalInfoSchema,
	socialsDataSchema,
} from "@quickcv/shared-schema";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { useCvFormStore } from "../provider/cv-form-provider";
import type { BaseFormState } from "../store/base-form-store";

interface SchemaConfig<T = unknown> {
	dataSelector: (state: BaseFormState) => T;
	updateFunction: (state: BaseFormState) => (data: T) => void;
}

const schemaConfigs = new WeakMap<z.ZodSchema, SchemaConfig>();

schemaConfigs.set(generalInfoSchema, {
	dataSelector: (state) => state.formData.generalInfo,
	updateFunction: (state) => state.updateGeneralInfo as (data: unknown) => void,
});

schemaConfigs.set(experienceDataSchema, {
	dataSelector: (state) => state.formData.experience,
	updateFunction: (state) => state.updateExperience as (data: unknown) => void,
});

schemaConfigs.set(educationDataSchema, {
	dataSelector: (state) => state.formData.education,
	updateFunction: (state) => state.updateEducation as (data: unknown) => void,
});

schemaConfigs.set(socialsDataSchema, {
	dataSelector: (state) => state.formData.socials,
	updateFunction: (state) => state.updateSocials as (data: unknown) => void,
});

interface UseFormResult<T extends z.ZodSchema> {
	form: ReturnType<typeof useForm<z.infer<T>>>;
	data: z.infer<T>;
}

export function useFormData<T extends z.ZodTypeAny>(
	schema: T,
): UseFormResult<T> {
	const config = schemaConfigs.get(schema);

	if (!config) {
		throw new Error("Unsupported schema provided to useFormData");
	}

	const store = useCvFormStore();
	const data = config.dataSelector(store);
	const updateFunction = config.updateFunction(store);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const form = useForm({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: data as z.infer<T>,
	});

	useEffect(() => {
		const sub = form.watch((value) => {
			console.log(value);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				console.log("updating value", value);
				updateFunction(value);
			}, 900);
		});

		return () => {
			sub.unsubscribe();
			updateFunction(form.getValues());
		};
	}, [form, updateFunction]);

	return {
		form,
		data,
	};
}
