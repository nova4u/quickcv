import type { FormData } from "@quickcv/shared-schema";
import type React from "react";
import { lazy, Suspense } from "react";

const PDFViewer = lazy(() =>
	import("@react-pdf/renderer").then((module) => ({
		default: module.PDFViewer,
	})),
);
const PDFDocument = lazy(() =>
	import("./pdf-document").then((module) => ({ default: module.PDFDocument })),
);

interface PDFPreviewProps {
	data: FormData;
	isOpen: boolean;
	onClose: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
	data,
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="text-lg font-semibold">PDF Preview</h3>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* PDF Viewer */}
				<div className="flex-1 p-4">
					<Suspense fallback={<div>Loading...</div>}>
						<PDFViewer width="100%" height="100%" showToolbar={true}>
							<PDFDocument data={data} />
						</PDFViewer>
					</Suspense>
				</div>
			</div>
		</div>
	);
};
