import { useApiKeyStore } from "@/features/settings/api-key.store";
import type { Deployment } from "@/services/deployment/deployment-provider";
import { VercelProjectCard } from "./vercel-project-card";

interface VercelProjectListProps {
	deployments: Deployment[];
	onEdit?: (deployment: Deployment) => void;
}

export function VercelProjectList({
	deployments,
	onEdit,
}: VercelProjectListProps) {
	const { vercelApiKey } = useApiKeyStore();

	if (!vercelApiKey) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">
					Please configure your Vercel API key to view projects.
				</p>
			</div>
		);
	}

	if (deployments.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">No deployments found.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 max-w-xl mx-auto">
			{deployments.map((deployment) => (
				<VercelProjectCard
					key={deployment.id}
					deployment={deployment}
					onEdit={() => onEdit?.(deployment)}
				/>
			))}
		</div>
	);
}
