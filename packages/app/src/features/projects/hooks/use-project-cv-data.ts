import type { FormData } from "@quickcv/shared-schema";
import { useQuery } from "@tanstack/react-query";
import { useApiKeyStore } from "@/features/settings/api-key.store";
import { vercelProvider } from "@/services/deployment/providers/vercel";

interface UseProjectCvDataOptions {
	projectName: string | null;
}

export function useProjectCvData({ projectName }: UseProjectCvDataOptions) {
	const { vercelApiKey } = useApiKeyStore();
	const { data, error, isLoading, isFetching, refetch } =
		useQuery<FormData | null>({
			queryKey: ["project-cv-data", projectName],
			queryFn: async () => {
				if (!vercelApiKey || !projectName)
					throw new Error("API key and project name are required");
				const cvData = await vercelProvider.getCvData(
					vercelApiKey,
					projectName,
				);
				return cvData;
			},
			enabled: !!(vercelApiKey && projectName),
			refetchInterval: 30 * 60 * 1000, // 30 minutes
			staleTime: 30 * 60 * 1000, // 30 minutes
			gcTime: 60 * 60 * 1000, // 1 hour
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 30000),
		});

	return {
		cvData: data,
		isLoading: isLoading || isFetching,
		error,
		refetch,
	};
}
