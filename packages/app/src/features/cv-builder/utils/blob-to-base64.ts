/**
 * Converts a Blob to base64 string using FileReader
 * @param blob The blob to convert
 * @returns Promise that resolves to base64 string (without data URL prefix)
 */
export async function blobToBase64(blob: Blob): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			// Remove the data URL prefix to get just the base64 string
			const base64 = result.split(",")[1];
			resolve(base64);
		};
		reader.onerror = (error) => {
			console.error("❌ FileReader error:", error);
			reject(error);
		};
		reader.readAsDataURL(blob);
	});
}