import type { FormData } from "@quickcv/shared-schema";
import { processFormDataForPDF } from "@/lib/image-utils";

/**
 * Generates a PDF blob from form data using React PDF
 * @param formData The form data to generate PDF from
 * @returns Promise that resolves to PDF Blob
 */
export async function generatePDFBlob(formData: FormData): Promise<Blob> {
	const processedData = await processFormDataForPDF(formData);

	return new Promise<Blob>((resolve, reject) => {
		// Create a temporary container for rendering
		const container = document.createElement("div");
		container.style.display = "none";
		document.body.appendChild(container);

		Promise.all([
			import("react-dom/client"),
			import("@react-pdf/renderer"),
			import("../components/pdf-document"),
		])
			.then(([{ createRoot }, { BlobProvider }, { PDFDocument }]) => {
				const root = createRoot(container);

				root.render(
					<BlobProvider document={<PDFDocument data={processedData} />}>
						{({ blob, loading, error }) => {
							if (error) {
								document.body.removeChild(container);
								reject(error);
							} else if (!loading && blob) {
								document.body.removeChild(container);
								resolve(blob);
							}
							return null;
						}}
					</BlobProvider>,
				);
			})
			.catch(reject);
	});
}
