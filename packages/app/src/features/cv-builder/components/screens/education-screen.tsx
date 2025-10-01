import {
	defaultEducationItem,
	type EducationItem,
	educationItemSchema,
} from "@quickcv/shared-schema";
import type React from "react";
import { useCvFormStore } from "../../provider/cv-form-provider";
import { CollectionScreen } from "../collection/collection-screen";
import { EducationList } from "../lists/education-list";

export const EducationScreen: React.FC = () => {
	const store = useCvFormStore();
	const data = store.formData.education;
	const updateEducation = store.updateEducation;

	const handleUpdateItems = (education: EducationItem[]) => {
		updateEducation({ education });
	};

	return (
		<CollectionScreen
			items={data.education}
			updateItems={handleUpdateItems}
			defaultItem={defaultEducationItem}
			itemSchema={educationItemSchema}
			listComponent={EducationList}
			screenTitle="EDUCATION"
			addButtonText="Add education"
			formTitle="EDUCATION"
			formSubtitle="// Include your educational background and qualifications"
		/>
	);
};
