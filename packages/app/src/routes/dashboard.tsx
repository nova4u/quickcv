import { createFileRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import BackgroundImage from "@/components/app-shell/background";
import Footer from "@/components/app-shell/footer";
import Header from "@/components/app-shell/header";
import Dashboard from "@/features/projects/components/dashboard";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

export default function DashboardPage() {
	return (
		<NuqsAdapter>
			<div className="sm:grid grid-rows-[auto_1fr_auto] min-h-screen w-screen">
				<BackgroundImage />
				<Header />
				<Dashboard className="my-10" />
				<Footer />
			</div>
		</NuqsAdapter>
	);
}
