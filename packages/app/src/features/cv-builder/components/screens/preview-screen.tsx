import type { FormData } from "@quickcv/shared-schema";
import React from "react";
import { RichTextDisplay } from "@/components/form/widgets/rich-text-content";
import { Button } from "@/components/ui/button";
import { useCvFormStore } from "../../provider/cv-form-provider";
import { generatePDFBlob } from "../../utils/pdf-generator";
import { EducationList } from "../lists/education-list";
import { ExperienceList } from "../lists/experience-list";
import { SocialsList } from "../lists/socials-list";
import { ScreenContent } from "../ui/screen-content";
import { ScreenHeader } from "../ui/screen-header";

// const PDFPreview = lazy(() =>
// 	import("../pdf-preview").then((module) => ({
// 		default: module.PDFPreview,
// 	})),
// );

const PDFDownloadComponent = ({
	children,
	data,
}: {
	children: (props: { loading: boolean }) => React.ReactNode;
	data: FormData;
}) => {
	const [isProcessing, setIsProcessing] = React.useState(false);

	const handleDownload = async () => {
		if (isProcessing) return;

		setIsProcessing(true);
		try {
			const pdfBlob = await generatePDFBlob(data);

			// Trigger download
			const fileName = `${data.generalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`;
			const url = URL.createObjectURL(pdfBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to generate PDF for download:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Button
			variant="test"
			size="sm"
			onClick={handleDownload}
			disabled={isProcessing}
		>
			{children({ loading: isProcessing })}
		</Button>
	);
};

export const PreviewScreen: React.FC = () => {
	// const [showPDFPreview, setShowPDFPreview] = React.useState(false);
	// const [processedDataForPDF, setProcessedDataForPDF] =
	// 	React.useState<FormData | null>(null);
	// const [isProcessingForPDF, setIsProcessingForPDF] = React.useState(false);
	const store = useCvFormStore();
	const data = store.formData;

	// const handlePDFPreview = async () => {
	// 	setIsProcessingForPDF(true);
	// 	try {
	// 		const processed = await processFormDataForPDF(data);
	// 		setProcessedDataForPDF(processed);
	// 		setShowPDFPreview(true);
	// 	} catch (error) {
	// 		console.error("Failed to process data for PDF:", error);
	// 		// Fallback to original data if processing fails
	// 		setProcessedDataForPDF(data);
	// 		setShowPDFPreview(true);
	// 	} finally {
	// 		setIsProcessingForPDF(false);
	// 	}
	// };

	return (
		<>
			<ScreenHeader title="Review" className="flex-1">
				<div className="flex items-center gap-2">
					{/* <Button variant="secondary" size="sm" onClick={handlePDFPreview}>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
						{isProcessingForPDF ? "Processing..." : "Preview PDF"}
					</Button> */}

					<PDFDownloadComponent data={data}>
						{({ loading }) =>
							loading ? (
								"Processing..."
							) : (
								<>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="7,10 12,15 17,10" />
										<line x1="12" y1="15" x2="12" y2="3" />
									</svg>
									Export PDF
								</>
							)
						}
					</PDFDownloadComponent>
				</div>
			</ScreenHeader>

			<ScreenContent key={"review-content"}>
				{/* General Info Section */}
				<div className="space-y-6">
					<div className="flex  gap-4">
						{data.generalInfo.photo && (
							<img
								src={data.generalInfo.photo}
								alt="Profile"
								className="w-20 h-20 rounded-full object-cover"
							/>
						)}
						<div className="space-y-0.5 text-gray-600 text-sm">
							<h2 className="text-xl font-bold text-gray-900">
								{data.generalInfo.fullName}
							</h2>
							<p>{data.generalInfo.professionalTitle}</p>

							{data.generalInfo.website && (
								<a
									className="text-blue-600"
									href={data.generalInfo.website}
									target="_blank"
									rel="noopener noreferrer"
								>
									{data.generalInfo.website.replace("https://", "")}
								</a>
							)}
						</div>
					</div>
					{data.generalInfo.about && (
						<RichTextDisplay content={data.generalInfo.about} />
					)}
				</div>

				{/* Experience Section */}
				{data.experience.experiences.length > 0 && (
					<div className="space-y-6">
						<h3 className="text-xl font-semibold text-gray-900">
							Work Experience
						</h3>
						<ExperienceList
							items={data.experience.experiences}
							showActions={false}
						/>
					</div>
				)}

				{/* Education Section */}
				{data.education.education.length > 0 && (
					<div className="space-y-6">
						<h3 className="text-xl font-semibold text-gray-900">Education</h3>
						<EducationList
							items={data.education.education}
							showActions={false}
						/>
					</div>
				)}

				{/* Socials Section */}
				{data.socials.socials.length > 0 && (
					<div className="space-y-6">
						<h3 className="text-xl font-semibold text-gray-900">Socials</h3>
						<SocialsList
							socials={data.socials.socials}
							showActions={false}
							showInlineEditing={false}
						/>
					</div>
				)}
			</ScreenContent>

			{/* {processedDataForPDF && (
				<Suspense fallback={null}>
					<PDFPreview
						data={processedDataForPDF}
						isOpen={showPDFPreview}
						onClose={() => {
							setShowPDFPreview(false);
							// Don't clear processedDataForPDF immediately to allow for reuse
						}}
					/>
				</Suspense>
			)} */}
		</>
	);
};
