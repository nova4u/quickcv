import { parseAsBoolean, parseAsStringEnum, useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import mockWizardData from "./data/mock";
import "./styles.css";
import templates, { type TemplateType } from "./utils/templates.gen";

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: motion
		Motion?: any;
		initializeMotionAnimations?: () => void;
	}
}

function DevApp() {
	const [activeTemplate, setActiveTemplate] = useQueryState(
		"template",
		parseAsStringEnum(Object.keys(templates) as TemplateType[]).withDefault(
			"professional" as TemplateType,
		),
	);

	const [isPreviewMode] = useQueryState(
		"preview",
		parseAsBoolean.withDefault(false),
	);

	const ActiveTemplateComponent = templates[activeTemplate].component;

	return (
		<div
			className="min-h-screen bg-gray-50"
			// ref={(node) => {
			// 	if (node) {
			// 		window.initializeMotionAnimations?.();
			// 	}
			// }}
		>
			{/* Tab Navigation - Hidden in preview mode */}
			{!isPreviewMode && (
				<div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex space-x-8">
							{Object.entries(templates).map(([key, template]) => (
								<button
									key={key}
									onClick={() => {
										// window.requestAnimationFrame(() => {
										// 	window.initializeMotionAnimations?.();
										// });
										return setActiveTemplate(key as TemplateType);
									}}
									className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
										activeTemplate === key
											? "border-blue-500 text-blue-600"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									}`}
								>
									{template.name} Template
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Template Content */}
			<div className={isPreviewMode ? "" : "py-8"}>
				<div
					className={`${isPreviewMode ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}
					data-theme={activeTemplate}
				>
					<div
						className={
							isPreviewMode
								? ""
								: "bg-white rounded-lg shadow-lg overflow-hidden"
						}
					>
						<ActiveTemplateComponent data={mockWizardData} />
					</div>
				</div>
			</div>
		</div>
	);
}

function App(): React.JSX.Element {
	return (
		<StrictMode>
			{/* @ts-expect-error - nuqs adapter type issue */}
			<NuqsAdapter>
				<DevApp />
			</NuqsAdapter>
		</StrictMode>
	);
}

const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	root.render(<App />);
} else {
	console.error("Root container not found");
}
