/**
 * String utility functions for sanitization and formatting
 */

/**
 * Sanitizes a string to be safe for use in URLs, filenames, or slugs
 *
 * @param input - The string to sanitize
 * @param options - Configuration options
 * @returns A sanitized string safe for URLs/filenames
 *
 * @example
 * ```ts
 * sanitizeString("John Doe's Portfolio!") // "john-doe-s-portfolio"
 * sanitizeString("José María García-López") // "jose-maria-garcia-lopez"
 * sanitizeString("  Multiple   Spaces  ") // "multiple-spaces"
 * ```
 */
export function sanitizeString(
	input: string,
	options: {
		/** Replace spaces and special chars with this character (default: "-") */
		separator?: string;
		/** Convert to lowercase (default: true) */
		lowercase?: boolean;
		/** Remove accents and diacritics (default: true) */
		removeAccents?: boolean;
		/** Maximum length of the output string */
		maxLength?: number;
		/** Fallback string if input is empty/invalid */
		fallback?: string;
	} = {},
): string {
	const {
		separator = "-",
		lowercase = true,
		removeAccents = true,
		maxLength,
		fallback = "",
	} = options;

	// Return fallback if input is invalid
	if (!input || typeof input !== "string" || input.trim() === "") {
		return fallback;
	}

	let result = input.trim();

	// Remove accents and diacritics
	if (removeAccents) {
		result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}

	// Convert to lowercase
	if (lowercase) {
		result = result.toLowerCase();
	}

	// Replace special characters and spaces with separator
	result = result
		.replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
		.replace(/[\s]+/g, separator) // Replace spaces with separator
		.replace(new RegExp(`\\${separator}+`, "g"), separator) // Replace multiple separators with single
		.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), ""); // Remove leading/trailing separators

	// Truncate if maxLength is specified
	if (maxLength && result.length > maxLength) {
		result = result
			.substring(0, maxLength)
			.replace(new RegExp(`\\${separator}+$`, "g"), "");
	}

	// Final fallback if sanitization resulted in empty string
	return result || fallback;
}

/**
 * Creates a filename-safe string with .pdf extension
 *
 * @param input - The string to convert to filename
 * @param fallback - Fallback filename if input is invalid (default: "document")
 * @returns A safe filename with .pdf extension
 *
 * @example
 * ```ts
 * createPDFFilename("John Doe") // "john-doe.pdf"
 * createPDFFilename("") // "document.pdf"
 * createPDFFilename("José María García-López") // "jose-maria-garcia-lopez.pdf"
 * ```
 */
export function createPDFFilename(
	input: string,
	fallback = "document",
): string {
	const sanitized = sanitizeString(input, { fallback });
	return `${sanitized}.pdf`;
}

/**
 * Creates a URL-safe slug from a string
 *
 * @param input - The string to convert to slug
 * @param maxLength - Maximum length of the slug (default: 50)
 * @returns A URL-safe slug
 *
 * @example
 * ```ts
 * createSlug("My Awesome Blog Post!") // "my-awesome-blog-post"
 * createSlug("This is a very long title that needs to be truncated", 20) // "this-is-a-very-long"
 * ```
 */
export function createSlug(input: string, maxLength = 50): string {
	return sanitizeString(input, { maxLength, fallback: "untitled" });
}

/**
 * Creates a project name safe for deployment platforms
 *
 * @param input - The string to convert to project name
 * @returns A safe project name
 *
 * @example
 * ```ts
 * createProjectName("My Portfolio Site") // "my-portfolio-site"
 * createProjectName("John's CV 2024") // "john-s-cv-2024"
 * ```
 */
export function createProjectName(input: string): string {
	return sanitizeString(input, { fallback: "my-project" });
}
