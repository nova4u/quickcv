import type { FormData } from "@quickcv/shared-schema";

/**
 * Compresses an image file to a smaller base64 string
 * Resizes to max 320px width and applies 90% quality
 */
export function compressImage(
	file: File,
	maxWidth = 320,
	quality = 0.9,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("Failed to get canvas context"));
					return;
				}

				const aspectRatio = img.height / img.width;
				const newWidth = Math.min(img.width, maxWidth);
				const newHeight = newWidth * aspectRatio;

				canvas.width = newWidth;
				canvas.height = newHeight;

				ctx.drawImage(img, 0, 0, newWidth, newHeight);

				const compressedBase64 = canvas.toDataURL("image/webp", quality);

				// Calculate and log compression results
				const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
				const compressedSizeBytes = Math.round(
					(compressedBase64.length * 3) / 4,
				);
				const compressedSizeMB = (compressedSizeBytes / (1024 * 1024)).toFixed(
					2,
				);
				const compressionRatio = (
					(1 - compressedSizeBytes / file.size) *
					100
				).toFixed(1);

				console.log(`📸 Image Compression Results:
					Original: ${originalSizeMB}MB (${file.size} bytes)
					Compressed: ${compressedSizeMB}MB (${compressedSizeBytes} bytes)
					Compression: ${compressionRatio}% smaller
					Dimensions: ${img.width}x${img.height} → ${newWidth}x${newHeight}`);

				resolve(compressedBase64);
			} catch (error) {
				reject(error);
			}
		};

		img.onerror = () => {
			reject(new Error("Failed to load image for compression"));
		};

		// Convert file to data URL for image loading
		const reader = new FileReader();
		reader.onload = (e) => {
			img.src = e.target?.result as string;
		};
		reader.onerror = () => {
			reject(new Error("Failed to read file"));
		};
		reader.readAsDataURL(file);
	});
}

/**
 * Converts a base64 image or URL to JPEG format for PDF compatibility
 * Only converts if the image is not already JPG/PNG
 */
export function convertImageToJPEG(
	imageInput: string,
	quality = 0.9,
): Promise<string> {
	return new Promise((resolve, reject) => {
		if (
			imageInput.includes("data:image/jpeg") ||
			imageInput.includes("data:image/png")
		) {
			resolve(imageInput);
			return;
		}

		// Check if input is a URL or base64
		const isUrl =
			imageInput.startsWith("http://") || imageInput.startsWith("https://");

		if (isUrl) {
			fetch(imageInput)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to fetch image: ${response.status}`);
					}
					return response.blob();
				})
				.then((blob) => {
					const reader = new FileReader();
					reader.onload = () => {
						const base64 = reader.result as string;
						convertImageToJPEG(base64, quality).then(resolve).catch(reject);
					};
					reader.onerror = () => reject(new Error("Failed to read blob"));
					reader.readAsDataURL(blob);
				})
				.catch(reject);
			return;
		}

		// Handle base64 input (original logic)
		const img = new Image();
		img.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("Failed to get canvas context"));
					return;
				}

				canvas.width = img.width;
				canvas.height = img.height;

				// Draw image on canvas
				ctx.drawImage(img, 0, 0);

				// Convert to JPEG
				const jpegBase64 = canvas.toDataURL("image/jpeg", quality);
				resolve(jpegBase64);
			} catch (error) {
				reject(error);
			}
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		img.src = imageInput;
	});
}

export async function processFormDataForPDF(data: FormData): Promise<FormData> {
	const photo = data.generalInfo?.photo;

	if (photo) {
		try {
			return {
				...data,
				generalInfo: {
					...data.generalInfo,
					photo: await convertImageToJPEG(photo),
				},
			};
		} catch (error) {
			console.error("Failed to convert image for PDF:", error);
		}
	}

	return data;
}

/**
 * Converts a base64 image string to a File object
 * @param base64String - Base64 string with data URL prefix (e.g., "data:image/webp;base64,...")
 * @param filename - Name for the file
 * @returns File object
 */
export function base64ToFile(base64String: string, filename: string): File {
	// Extract the MIME type and base64 data
	const [header, data] = base64String.split(",");
	const mimeType = header.match(/:(.*?);/)?.[1] || "image/webp";

	// Convert base64 to binary
	const byteCharacters = atob(data);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);

	// Create blob and file
	const blob = new Blob([byteArray], { type: mimeType });
	return new File([blob], filename, { type: mimeType });
}
