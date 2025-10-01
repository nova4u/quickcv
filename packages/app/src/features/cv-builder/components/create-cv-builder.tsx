import { CvFormProvider } from "../provider/cv-form-provider";
import { FormNavigationProvider } from "../provider/form-navigation-provider";
import { CvBuilderContent } from "./cv-builder-content";

interface CvBuilderProps {
	className?: string;
	icon?: () => React.ReactNode;
	containerClassName?: string;
	footer?: React.ReactNode;
}

export function CvBuilder(props: CvBuilderProps) {
	return (
		<CvFormProvider mode="create">
			<FormNavigationProvider>
				<CvBuilderContent {...props} />
			</FormNavigationProvider>
		</CvFormProvider>
	);
}
