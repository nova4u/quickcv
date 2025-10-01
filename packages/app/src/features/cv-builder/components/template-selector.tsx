import {
	type TemplateType,
	templatePreviews,
	templates,
} from "@quickcv/templates";

interface TemplateSelectorProps {
	selectedTemplate: TemplateType | undefined;
	onTemplateSelect: (template: TemplateType) => void;
}

const TemplateSelector = ({
	selectedTemplate,
	onTemplateSelect,
}: TemplateSelectorProps) => {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium text-gray-900">Choose Template</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Object.entries(templates).map(([key, template]) => {
					const previewImage =
						templatePreviews[key as keyof typeof templatePreviews];
					const isSelected = selectedTemplate === key;

					return (
						<button
							key={key}
							type="button"
							onClick={() => onTemplateSelect(key as TemplateType)}
							className={`relative group bg-slate-50 overflow-hidden h-60 rounded-lg border-1 transition-all duration-200 hover:shadow-lg ${
								isSelected ? "border-blue-500" : "border-transparent"
							}`}
						>
							{/* Preview Image */}
							<div className="overflow-hidden">
								<img
									src={previewImage}
									alt={`${template.name} template preview`}
									className={
										"h-full object-contain w-19/20 mx-auto rounded-md  object-top transition-transform duration-200"
									}
								/>
							</div>

							{/* Template Name and Selected Indicator */}
							<div className="absolute inset-x-0 bottom-0 py-5 px-3 bg-gradient-to-t from-white via-white to-transparent">
								<div className="flex items-center justify-between">
									<h4 className="text-sm font-medium text-black">
										{template.name}
									</h4>
									{isSelected && (
										<div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
											<svg
												className="w-3 h-3 text-white"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									)}
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default TemplateSelector;
