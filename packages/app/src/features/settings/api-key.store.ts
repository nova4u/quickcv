import { create } from "zustand";
import { persist } from "zustand/middleware";

// interface VercelProject {
//	id: string;
//	name: string;
//	url: string;
//	updatedAt: number;
//	createdAt: number;
// }

interface ApiKeyState {
	vercelApiKey: string | null;
	isConfigured: boolean;
	setVercelApiKey: (key: string) => void;
	clearVercelApiKey: () => void;
	validateApiKey: (key: string) => Promise<boolean>;
}

export const useApiKeyStore = create<ApiKeyState>()(
	persist(
		(set) => ({
			vercelApiKey: null,
			isConfigured: false,
			projects: [],
			isLoadingProjects: false,

			setVercelApiKey: (key: string) => {
				set({
					vercelApiKey: key,
					isConfigured: true,
				});
			},

			clearVercelApiKey: () => {
				set({
					vercelApiKey: null,
					isConfigured: false,
					// projects: [],
				});
			},

			validateApiKey: async (key: string): Promise<boolean> => {
				if (!key || key.length < 20) return false;
				try {
					const userResponse = await fetch("https://api.vercel.com/v2/user", {
						headers: {
							Authorization: `Bearer ${key}`,
						},
					});
					if (!userResponse.ok) return false;
					return true;
				} catch (error) {
					console.error(error);
					return false;
				}
			},
		}),
		{
			name: "portfolio-builder-api-keys",
			partialize: (state) => ({
				vercelApiKey: state.vercelApiKey,
				isConfigured: state.isConfigured,
			}),
		},
	),
);
