import type { SchemaUIMetadata } from "@quickcv/shared-schema";
import { type PropsWithChildren, useContext } from "react";
import { Controller, type FieldError, useFormContext } from "react-hook-form";
import FormLabel from "@/components/form/form-label";
import FormMessage from "@/components/form/form-message";
import { isZodFieldRequired } from "@/lib/zod-utils";
import { SchemaContext } from "@/shared/providers/form-provider";
import { Checkbox } from "./widgets/checkbox";
import DateRange, { type DateRangeProps } from "./widgets/date-range";
import { Input } from "./widgets/input";
import {
	PhotoUploader,
	type PhotoUploaderProps,
} from "./widgets/photo-uploader";
import { Radio } from "./widgets/radio";
import {
	RichTextEditor,
	type RichTextEditorProps,
} from "./widgets/rich-text-editor";
import { Textarea, type TextareaProps } from "./widgets/textarea";
import { UrlInput } from "./widgets/url-input";

export interface BaseInputProps {
	name: string;
	label?: string;
	placeholder?: string;
	className?: string;
	id?: string;
	required?: boolean;
	disabled?: boolean;
}

export type StandardInputProps = BaseInputProps & {
	type: SchemaUIMetadata["widget"];
};

type BaseComponentProps<T> = BaseInputProps & Omit<T, "onChange" | "name">;

interface TextareaInputProps extends BaseComponentProps<TextareaProps> {
	type: "textarea";
	rows?: number;
}

interface DateRangeInputProps extends BaseComponentProps<DateRangeProps> {
	type: "daterange";
}

interface ImageUploaderInputProps
	extends BaseComponentProps<PhotoUploaderProps> {
	type: "imageUploader";
}

interface RichTextInputProps extends BaseComponentProps<RichTextEditorProps> {
	type: "richtext";
}

export type RadioOption = {
	value: string;
	label: string;
};

interface RadioInputProps extends BaseInputProps {
	type: "radio";
	options: RadioOption[];
}

export type FormItemProps = (
	| StandardInputProps
	| TextareaInputProps
	| ImageUploaderInputProps
	| RichTextInputProps
	| DateRangeInputProps
	| RadioInputProps
) & {
	showLabel?: boolean;
	customErrorHandling?: boolean;
};

export function FormItem({
	name,
	label,
	showLabel = true,
	placeholder,
	required,
	id,
	className,
	children,
	type,
	disabled,
	customErrorHandling = false,
	...rest
}: PropsWithChildren<FormItemProps>) {
	const { getFieldState, formState, control } = useFormContext();
	const fieldState = getFieldState(name, formState);
	const schema = useContext(SchemaContext);
	const isRequired =
		required || (schema ? isZodFieldRequired(schema, name) : false);

	return (
		<div className="space-y-1">
			{showLabel && label && (
				<FormLabel htmlFor={id || name} className="block" required={isRequired}>
					{label}
				</FormLabel>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field }) => {
					if (type === "checkbox") {
						return (
							<div className="flex items-center gap-1">
								<Checkbox
									id={id || name}
									checked={field.value || false}
									{...field}
								/>
								{label && (
									<label
										htmlFor={id || name}
										className="text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57 cursor-pointer"
									>
										{label}
									</label>
								)}
							</div>
						);
					}

					if (type === "radio") {
						const { options } = rest as RadioInputProps;
						return (
							<div className="space-y-3">
								{options.map((option) => (
									<Radio
										key={option.value}
										checked={field.value === option.value}
										onChange={() => field.onChange(option.value)}
										name={field.name}
										value={option.value}
										label={option.label}
										id={option.value}
									/>
								))}
							</div>
						);
					}

					if (type === "textarea") {
						const { rows = 4 } = rest as TextareaInputProps;
						return (
							<Textarea
								id={id || name}
								label={label}
								placeholder={placeholder}
								invalid={fieldState.invalid}
								rows={rows}
								className={className}
								required={isRequired}
								{...rest}
								{...field}
							>
								{children}
							</Textarea>
						);
					}

					if (type === "richtext") {
						return (
							<RichTextEditor
								id={id || name}
								label={label}
								placeholder={placeholder}
								required={isRequired}
								{...rest}
								{...field}
							/>
						);
					}
					if (type === "imageUploader") {
						return (
							<PhotoUploader
								id={id || name}
								label={label}
								{...field}
								{...rest}
							/>
						);
					}

					if (type === "daterange") {
						return (
							<DateRange
								id={id || name}
								label={label}
								placeholder={placeholder}
								required={isRequired}
								error={
									fieldState.error as { [key: string]: FieldError } | undefined
								}
								isDirty={fieldState.isDirty}
								{...rest}
								{...field}
							/>
						);
					}
					if (type === "link") {
						return (
							<UrlInput
								id={name}
								label={label}
								type={type}
								placeholder={placeholder}
								invalid={fieldState.invalid}
								className={className}
								required={isRequired}
								{...field}
							/>
						);
					}

					return (
						<Input
							id={name}
							label={label}
							type={type}
							placeholder={placeholder}
							invalid={fieldState.invalid}
							className={className}
							required={isRequired}
							disabled={disabled}
							{...field}
						/>
					);
				}}
			/>

			{!customErrorHandling && (
				<FormMessage name={name} error={fieldState.error} />
			)}
		</div>
	);
}
