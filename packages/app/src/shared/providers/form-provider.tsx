import { type ComponentProps, createContext } from "react";
import { FormProvider as RHFFormProvider } from "react-hook-form";
import type z from "zod";

export const SchemaContext = createContext<z.ZodSchema | null>(null);

type FormProviderProps<T extends z.ZodSchema> = {
	children: React.ReactNode;
	schema?: T;
} & ComponentProps<typeof RHFFormProvider<z.infer<T>>>;

export default function FormProvider<T extends z.ZodSchema>({
	children,
	schema,
	...props
}: FormProviderProps<T>) {
	return (
		<RHFFormProvider {...props}>
			<SchemaContext.Provider value={schema || null}>
				{children}
			</SchemaContext.Provider>
		</RHFFormProvider>
	);
}
