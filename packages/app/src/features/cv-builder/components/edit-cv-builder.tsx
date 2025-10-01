import type { FormData } from "@quickcv/shared-schema";
import { CvFormProvider } from "../provider/cv-form-provider";
import { FormNavigationProvider } from "../provider/form-navigation-provider";
import { CvBuilderContent } from "./cv-builder-content";

interface EditCvBuilderProps {
	cvData: FormData;
	projectName: string;
	className?: string;
	icon?: () => React.ReactNode;
	containerClassName?: string;
	footer?: React.ReactNode;
}

/**
 * CV Builder for editing existing CVs.
 * Uses the unified CV form provider in edit mode.
 */
export function EditCvBuilder({
	cvData,
	projectName,
	...props
}: EditCvBuilderProps) {
	return (
		<CvFormProvider mode="edit" cvData={cvData} projectName={projectName}>
			<FormNavigationProvider>
				<CvBuilderContent {...props} />
			</FormNavigationProvider>
		</CvFormProvider>
	);
}
