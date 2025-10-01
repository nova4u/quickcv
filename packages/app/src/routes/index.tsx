import { createFileRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import BackgroundImage from "@/components/app-shell/background";
import Footer from "@/components/app-shell/footer";
import Header from "@/components/app-shell/header";
import { CvBuilder } from "@/features/cv-builder/components/create-cv-builder";

export const Route = createFileRoute("/")({
	component: Home,
});

export default function Home() {
	return (
		<NuqsAdapter>
			<div className="sm:grid grid-rows-[auto_1fr_auto] min-h-screen w-screen">
				<BackgroundImage />
				<Header />
				<CvBuilder className="my-10" />
				<Footer />
			</div>
		</NuqsAdapter>
	);
}
