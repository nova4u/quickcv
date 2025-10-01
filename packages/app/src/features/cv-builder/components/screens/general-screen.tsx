import { generalInfoSchema } from "@quickcv/shared-schema";
import { memo } from "react";
import { FormItem } from "@/components/form/form-item";
import { useFormData } from "@/features/cv-builder/hooks/use-form";
import FormProvider from "@/shared/providers/form-provider";
import { ScreenContent } from "../ui/screen-content";
import { ScreenHeader } from "../ui/screen-header";

function selectFirstInputOnMount(node: HTMLFormElement) {
	if (node) {
		const input = node.querySelector("input[type='text']") as HTMLInputElement;
		if (input) {
			input.focus();
		}
	}
}

const GeneralScreen: React.FC = () => {
	const { form } = useFormData(generalInfoSchema);

	return (
		<>
			<ScreenHeader
				title="GENERAL INFO"
				rightContent={{
					type: "text",
					content: "// Add your professional experience and achievements",
				}}
			/>
			<ScreenContent key="general-info-content">
				<FormProvider schema={generalInfoSchema} {...form}>
					<form className="space-y-4" ref={selectFirstInputOnMount}>
						<div className="flex flex-col sm:flex-row gap-10">
							<div className="flex-shrink-0">
								<FormItem
									shape="square"
									size="base"
									name="photo"
									label="Profile Photo"
									type="imageUploader"
									required
								/>
							</div>
							<div className="flex-1 space-y-2">
								<FormItem
									required
									name="fullName"
									label="Full Name"
									placeholder="John Doe"
									type="text"
								/>

								<FormItem
									name="professionalTitle"
									label="Professional Title"
									placeholder="Software Engineer"
									type="text"
									required
								/>
								<FormItem
									required
									name="website"
									label="Website"
									placeholder="https://www.example.com"
									type="link"
								/>
							</div>
						</div>
						<FormItem
							name="about"
							label="About"
							placeholder="A brief summary of your professional experience and achievements"
							type="richtext"
						/>
					</form>
				</FormProvider>
			</ScreenContent>
		</>
	);
};

export default memo(GeneralScreen);
