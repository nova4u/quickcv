import { useRef } from "react";
import { useCvFormStore } from "../../provider/cv-form-provider";
import type { SocialItem } from "../../store/form-store";
import { SocialsList, type SocialsListRef } from "../lists/socials-list";
import { ScreenContent } from "../ui/screen-content";
import { ScreenHeader } from "../ui/screen-header";

export const SocialScreen: React.FC = () => {
	const socialsListRef = useRef<SocialsListRef>(null);

	const store = useCvFormStore();
	const data = store.formData.socials;
	const onDataChange = store.updateSocials;

	const handleSocialsChange = (socials: SocialItem[]) => {
		onDataChange({ socials });
	};

	const handleAddSocial = () => {
		socialsListRef.current?.handleAddNew();
	};

	return (
		<>
			<ScreenHeader
				title="SOCIALS"
				rightContent={{
					type: "button",
					content: "Add social",
					onClick: handleAddSocial,
				}}
			/>

			<ScreenContent key={"socials-list-content"}>
				<SocialsList
					ref={socialsListRef}
					socials={data.socials}
					onDataChange={handleSocialsChange}
					showActions={true}
					showInlineEditing={true}
				/>
			</ScreenContent>
		</>
	);
};
