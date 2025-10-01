import {
	defaultExperienceItem,
	type ExperienceItem,
	experienceItemSchema,
} from "@quickcv/shared-schema";
import type React from "react";
import { useCvFormStore } from "../../provider/cv-form-provider";
import { CollectionScreen } from "../collection/collection-screen";
import { ExperienceList } from "../lists/experience-list";

export const ExperienceScreen: React.FC = () => {
	const store = useCvFormStore();
	const data = store.formData.experience;
	const updateExperience = store.updateExperience;

	const handleUpdateItems = (experiences: ExperienceItem[]) => {
		updateExperience({ experiences });
	};

	return (
		<CollectionScreen
			items={data.experiences}
			updateItems={handleUpdateItems}
			defaultItem={defaultExperienceItem}
			itemSchema={experienceItemSchema}
			listComponent={ExperienceList}
			screenTitle="WORK EXPERIENCE"
			addButtonText="Add work experience"
			formTitle="EXPERIENCE"
			formSubtitle="// Add your professional experience and achievements"
		/>
	);
};
