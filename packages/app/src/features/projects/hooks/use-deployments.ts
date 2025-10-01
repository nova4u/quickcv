import { useQuery } from "@tanstack/react-query";
import { useApiKeyStore } from "@/features/settings/api-key.store";
import type { Deployment } from "@/services/deployment/deployment-provider";
import { vercelProvider } from "@/services/deployment/providers/vercel";

export function useDeployments() {
	const { vercelApiKey } = useApiKeyStore();
	const { data, error, isLoading, refetch } = useQuery<Deployment[]>({
		queryKey: ["deployments", vercelApiKey],
		queryFn: async () => {
			if (!vercelApiKey) throw new Error("API key is required");
			console.log("fetching...");
			const deployments = await vercelProvider.listDeployments(vercelApiKey);
			console.log("finished fetching...");
			return deployments;
		},
		enabled: !!vercelApiKey,
		refetchInterval: 15 * 60 * 1000, // 15 minutes
		staleTime: 15 * 60 * 1000, // 15 minutes
		gcTime: 30 * 60 * 1000, // 30 minutes
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 30000),
	});

	return {
		deployments: data || [],
		isLoading,
		error,
		refetch,
	};
}
