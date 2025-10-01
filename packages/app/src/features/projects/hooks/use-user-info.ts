import { useQuery } from "@tanstack/react-query";
import { vercelProvider } from "@/services/deployment/providers/vercel";

interface UserInfo {
	username: string;
	name?: string;
	email?: string;
}

interface UseUserInfoOptions {
	apiKey: string | null;
}

export function useUserInfo({ apiKey }: UseUserInfoOptions) {
	const { data, error, isLoading, refetch } = useQuery<UserInfo | null>({
		queryKey: ["userInfo", apiKey],
		queryFn: async () => {
			if (!apiKey) throw new Error("API key is required");
			const validation = await vercelProvider.validateApiKey(apiKey);
			if (validation.isValid && validation.userInfo) {
				return validation.userInfo;
			}
			return null;
		},
		enabled: !!apiKey,
		refetchInterval: 15 * 60 * 1000, // 15 minutes
		staleTime: 15 * 60 * 1000, // 15 minutes
		gcTime: 30 * 60 * 1000, // 30 minutes
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 30000),
	});

	return {
		userInfo: data || null,
		isLoading,
		error,
		refetch,
	};
}
