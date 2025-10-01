import { createFileRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import BackgroundImage from "@/components/app-shell/background";
import Footer from "@/components/app-shell/footer";
import Header from "@/components/app-shell/header";
import EditPage from "@/features/cv-builder/components/edit-page";

export const Route = createFileRoute("/edit/$projectName")({
	component: EditPageRoute,
});

export default function EditPageRoute() {
	const { projectName } = Route.useParams();

	return (
		<NuqsAdapter>
			<div className="sm:grid grid-rows-[auto_1fr_auto] min-h-screen">
				<BackgroundImage />
				<Header />
				<EditPage projectName={projectName} className="my-10" />
				<Footer />
			</div>
		</NuqsAdapter>
	);
}
