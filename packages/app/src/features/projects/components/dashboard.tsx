import { useNavigate } from "@tanstack/react-router";
import { DocumentLoader } from "@/components/ui/document-loader";
import { useApiKeyStore } from "@/features/settings/api-key.store";
import { ApiKeyForm } from "@/features/settings/components/api-key-form";
import type { Deployment } from "@/services/deployment/deployment-provider";
import { useDeployments } from "../hooks/use-deployments";
import { VercelProjectList } from "./vercel-project-list";

interface DashboardProps {
	className?: string;
}

export default function Dashboard({ className }: DashboardProps) {
	const { isConfigured } = useApiKeyStore();
	const navigate = useNavigate();

	const {
		deployments,
		isLoading: deploymentsLoading,
		error: deploymentsError,
		// refetch,
	} = useDeployments();

	const isLoading = deploymentsLoading;

	if (deploymentsError) {
		console.error("Failed to load deployments:", deploymentsError);
	}

	function handleEdit(deployment: Deployment) {
		navigate({
			to: "/edit/$projectName",
			params: { projectName: deployment.name },
		});
	}

	// function handleVercelSettings(deployment: Deployment) {
	// 	// TODO: Open Vercel settings or navigate to Vercel dashboard
	// 	const vercelUrl = `https://vercel.com/${userInfo?.username}/${deployment.name}`;
	// 	window.open(vercelUrl, "_blank", "noopener,noreferrer");
	// }

	if (!isConfigured) {
		return (
			<div className={className}>
				<div className="max-w-4xl mx-auto px-4 py-16">
					<div className="max-w-lg mx-auto">
						<div
							className="bg-white rounded-[24px] shadow-lg overflow-hidden"
							style={{
								boxShadow:
									"0px 8px 8px -4px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
							}}
						>
							<div className="px-5 pt-5">
								<h2 className="text-lg font-semibold mb-2">
									Authenticate with Vercel
								</h2>
								<p className="text-sm text-gray-600">
									To manage your live CV sites, we need your Vercel API token.
								</p>
							</div>
							<ApiKeyForm />
							<div className="text-xs bg-gray-100 px-5 py-4 text-gray-700 space-y-1 rounded-t-md mt-4">
								<p>Your API key is stored locally in your browser</p>
								<p>We never send your API key to our servers</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="max-w-6xl mx-auto px-4">
				{isLoading ? (
					<DocumentLoader text="Loading your projects..." />
				) : (
					<VercelProjectList deployments={deployments} onEdit={handleEdit} />
				)}
			</div>
		</div>
	);
}
