import { z } from "zod";

function extractZodSchema(
	schema: z.ZodSchema | z.ZodEffects<z.ZodSchema, unknown, unknown>,
) {
	return schema instanceof z.ZodEffects ? schema._def.schema : schema;
}

export function isZodFieldRequired(
	schema: z.ZodSchema,
	fieldPath: string,
): boolean {
	try {
		schema = extractZodSchema(schema);
		if (schema instanceof z.ZodObject) {
			const shape = schema.shape;
			const field = shape[fieldPath];
			if (!field) return false;

			return !field.isOptional();
		}

		return false;
	} catch {
		return false;
	}
}
