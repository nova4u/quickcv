/**
 * Utilities for handling photo URLs in CV builder
 */

export interface PhotoProcessingResult {
	photoBase64: string | null;
	photoFilename: string | null;
	photoPath: string | null;
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64DataUrl(value: string | null | undefined): boolean {
	if (!value) return false;
	return value.startsWith("data:image/");
}

/**
 * Check if a string is a deployed photo URL
 */
export function isDeployedPhotoUrl(value: string | null | undefined): boolean {
	if (!value) return false;
	return value.startsWith("http") && !value.startsWith("data:");
}

/**
 * Convert URL photo to base64 for deployment
 */
export async function fetchPhotoAsBase64(
	photoUrl: string,
): Promise<string | null> {
	try {
		const response = await fetch(photoUrl);
		if (!response.ok) return null;

		const blob = await response.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error("Failed to fetch photo:", error);
		return null;
	}
}

/**
 * Process a new photo upload (base64 data URL)
 */
export async function processNewPhotoUpload(
	photoData: string,
): Promise<PhotoProcessingResult> {
	const timestamp = Date.now();
	const filename = `profile-photo-${timestamp}.webp`;

	return {
		photoBase64: photoData,
		photoFilename: filename,
		photoPath: `./${filename}`,
	};
}

/**
 * Process an existing deployed photo URL
 */
export async function processExistingPhoto(
	photoUrl: string,
): Promise<PhotoProcessingResult> {
	const photoBase64 = await fetchPhotoAsBase64(photoUrl);

	if (!photoBase64) {
		return { photoBase64: null, photoFilename: null, photoPath: null };
	}

	const timestamp = Date.now();
	const filename = `profile-photo-${timestamp}.webp`;

	return {
		photoBase64,
		photoFilename: filename,
		photoPath: `./${filename}`,
	};
}

/**
 * Process photo based on its type and current state
 */
export async function processPhoto(
	photo: string | null,
): Promise<PhotoProcessingResult> {
	// No photo case
	if (!photo) {
		return { photoBase64: null, photoFilename: null, photoPath: null };
	}

	// New photo upload
	if (isBase64DataUrl(photo)) {
		return processNewPhotoUpload(photo);
	}

	// Existing deployed photo
	if (isDeployedPhotoUrl(photo)) {
		return processExistingPhoto(photo);
	}

	// Unknown photo format
	return { photoBase64: null, photoFilename: null, photoPath: null };
}

/**
 * Build a photo URL by combining deployment URL with a photo path/filename
 * Handles relative paths, filenames, and cleans up URL formatting
 * @param deploymentUrl - Base deployment URL like "https://my-cv.vercel.app"
 * @param photoPath - Photo path/filename like "./profile-photo-123.webp", "profile-photo.webp", etc.
 * @returns Full photo URL like "https://my-cv.vercel.app/profile-photo-123.webp"
 */
export function buildPhotoUrl(
	deploymentUrl: string,
	photoPath = "profile-photo.webp",
): string {
	// Remove leading "./" or "." from relative path
	const cleanPath = photoPath.replace(/^\.\//, "").replace(/^\./, "");

	// Remove trailing slash if present
	const baseUrl = deploymentUrl.replace(/\/$/, "");

	return `${baseUrl}/${cleanPath}`;
}
