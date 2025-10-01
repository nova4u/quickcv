import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type z from "zod";
import { extractFormFields, groupFormFields } from "@/lib/zod-form-utils";
import FormProvider from "@/shared/providers/form-provider";
import { FormItem } from "./form-item";

export interface FormRef {
	submit: () => void;
	reset: () => void;
}

export interface FormProps<T extends z.ZodTypeAny>
	extends Omit<React.ComponentProps<"form">, "onSubmit" | "children"> {
	schema: T;
	defaultValues: z.infer<T>;
	onSubmit: (data: z.infer<T>) => Promise<void> | void;
	children?: (form: UseFormReturn<z.infer<T>>) => React.ReactNode;
}

const Form = forwardRef<FormRef, FormProps<z.ZodTypeAny>>(function Form<
	T extends z.ZodTypeAny,
>(
	{
		schema,
		defaultValues,
		onSubmit,
		children,
		className = "space-y-4",
		...rest
	}: FormProps<T>,
	ref: React.Ref<FormRef>,
) {
	const form = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		defaultValues,
		mode: "onSubmit",
		reValidateMode: "onChange",
	});

	const fields = useMemo(() => extractFormFields(schema), [schema]);
	const fieldGroups = groupFormFields(fields);

	useImperativeHandle(
		ref,
		() => ({
			submit: () => {
				form.handleSubmit(onSubmit)();
			},
			reset: () => {
				form.reset();
			},
		}),
		[form.reset, form.handleSubmit, onSubmit],
	);

	return (
		<FormProvider schema={schema} {...form}>
			<form
				className={className}
				onSubmit={form.handleSubmit(onSubmit)}
				{...rest}
			>
				{fieldGroups.map((group) => {
					if (group.type === "row") {
						return (
							<div
								key={group.key}
								className="flex-col md:flex-row flex gap-6 [&>*]:flex-1"
							>
								{group.fields.map((field) => (
									<FormItem key={field.name} {...field} />
								))}
							</div>
						);
					}

					return group.fields.map((field) => (
						<FormItem key={field.name} {...field} />
					));
				})}

				{children?.(form)}
			</form>
		</FormProvider>
	);
});

export { Form };
