import type { FormFieldConfig, SchemaUIMetadata } from "@quickcv/shared-schema";
import type { z } from "zod";

/**
 * Extracts form field configurations directly from a Zod schema
 * without the need for JSON schema conversion
 */
export function extractFormFields<T extends z.ZodTypeAny>(
	schema: T,
): FormFieldConfig[] {
	const fields: FormFieldConfig[] = [];

	// Handle ZodObject directly
	if (schema._def.typeName === "ZodObject") {
		const shape = schema._def.shape();

		Object.entries(shape).forEach(([fieldName, fieldSchema]: [string, any]) => {
			try {
				// Extract metadata from description (our createUIMetadata cast)
				const description = fieldSchema._def.description;
				const metadata = description as unknown as SchemaUIMetadata;

				// Determine if field is required
				const isRequired = !fieldSchema.isOptional();

				// Create field config
				const fieldConfig: FormFieldConfig = {
					name: fieldName,
					type: metadata?.widget || "text",
					required: isRequired,
					label: metadata?.label || fieldName,
					placeholder: metadata?.placeholder || "",
					...metadata,
				};

				fields.push(fieldConfig);
			} catch (error) {
				console.error(`Error processing field ${fieldName}:`, error);
			}
		});
	}

	return fields;
}

/**
 * Groups form fields by their layout configuration
 */
export function groupFormFields(fields: FormFieldConfig[]) {
	const groups: Array<{
		key: string;
		type: "single" | "row" | "column";
		fields: FormFieldConfig[];
	}> = [];

	const processedIndices = new Set<number>();

	fields.forEach((field, index) => {
		if (processedIndices.has(index)) return;

		const { layout } = field;

		// Single field without group
		if (!layout?.group) {
			groups.push({
				key: `single-${field.name}`,
				type: "single",
				fields: [field],
			});
			processedIndices.add(index);
			return;
		}

		// Find all fields in the same group
		const groupFields = fields
			.map((f, i) => ({ field: f, index: i }))
			.filter(
				({ field: f, index: i }) =>
					f.layout?.group === layout.group && !processedIndices.has(i),
			);

		groupFields.forEach(({ index }) => processedIndices.add(index));

		const groupType = layout.groupType === "row" ? "row" : "column";

		groups.push({
			key: `${layout.group}-group`,
			type: groupType,
			fields: groupFields.map(({ field: { layout, ...field } }) => field),
		});
	});

	return groups;
}
