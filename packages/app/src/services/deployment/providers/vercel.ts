import type { FormData } from "@quickcv/shared-schema";
import { Vercel } from "@vercel/sdk";
import type { Deployments } from "@vercel/sdk/models/getdeploymentsop";
import { config as appConfig } from "@/config/app";
import { buildPhotoUrl } from "@/lib/photo-utils";
import type {
	Deployment,
	DeploymentConfig,
	DeploymentProvider,
	DeploymentResult,
	ValidationResult,
} from "../deployment-provider";

interface VercelProjectAlias {
	configuredBy: string;
	configuredChangedAt: number;
	createdAt: number;
	deployment: {
		alias: string[];
		aliasAssigned: number;
		builds: unknown[];
		createdAt: number;
		createdIn: string;
	};
	domain: string;
	environment: string;
	target: string;
}

interface VercelProject {
	id: string;
	name: string;
	createdAt: number;
	alias?: VercelProjectAlias[];
}

interface VercelProjectsResponse {
	projects: VercelProject[];
}

export class VercelDeploymentProvider implements DeploymentProvider {
	name = "Vercel";

	private vercelInstance?: Vercel;
	private currentApiKey?: string;

	private getVercelInstance(apiKey: string): Vercel {
		if (this.vercelInstance && this.currentApiKey === apiKey) {
			return this.vercelInstance;
		}

		this.vercelInstance = new Vercel({ bearerToken: apiKey });
		this.currentApiKey = apiKey;
		return this.vercelInstance;
	}

	async validateApiKey(apiKey: string): Promise<ValidationResult> {
		try {
			const vercel = this.getVercelInstance(apiKey);
			const user = await vercel.user.getAuthUser();

			return {
				isValid: true,
				userInfo: {
					username: user.user.username,
					avatar: `https://vercel.com/api/www/avatar?s=64&u=${user.user.username}`,
					email: user.user.email,
					name: user.user.name ?? undefined,
				},
			};
		} catch (error) {
			return {
				isValid: false,
				error:
					error instanceof Error
						? error.message
						: "Invalid API key or network error",
			};
		}
	}

	async listDeployments(
		apiKey: string,
		prefix?: string,
	): Promise<Deployment[]> {
		const actualPrefix = prefix ?? appConfig.projectPrefix;
		try {
			const response = await fetch(
				`https://api.vercel.com/v1/projects?limit=100&search=${actualPrefix}`,
				{
					headers: {
						Authorization: `Bearer ${apiKey}`,
					},
				},
			);

			if (!response.ok) {
				throw new Error(
					`Vercel API error: ${response.status} ${response.statusText}`,
				);
			}

			const data =
				(await response.json()) as VercelProjectsResponse["projects"];

			const projects = await Promise.all(
				data
					.map(async (project) => {
						const domain = project.alias?.find(
							(alias: VercelProjectAlias) =>
								alias.target.toLowerCase() === "production",
						)?.domain;

						const projectUrl = "";
						if (!domain) return undefined;

						return {
							id: project.id,
							name: project.name,
							url: projectUrl,
							domain,
							status: "ready",
							createdAt: new Date(project.createdAt ?? 0),
							updatedAt: new Date(project.createdAt ?? 0),
						};
					})
					.filter(Boolean) as Promise<Deployment>[],
			);

			return projects;
		} catch (error) {
			console.error("Failed to list deployments:", error);
			return [];
		}
	}

	async createDeployment(
		apiKey: string,
		config: DeploymentConfig,
	): Promise<DeploymentResult> {
		try {
			// For now, we'll create a basic deployment using the REST API directly
			// since the SDK types are complex and inconsistent
			const deploymentName = config.name.startsWith(appConfig.projectPrefix)
				? config.name
				: `${appConfig.projectPrefix}-${config.name}`;

			const vercel = this.getVercelInstance(apiKey);
			const response = await vercel.deployments.createDeployment({
				requestBody: {
					name: deploymentName,
					files: Object.entries(config.files).map(([file, data]) => {
						// Handle files with encoding (like base64 PDFs)
						if (typeof data === "object" && data !== null && "data" in data) {
							const fileWithEncoding = data as {
								data: string;
								encoding: string;
							};
							return {
								file,
								data: fileWithEncoding.data,
								encoding: fileWithEncoding.encoding || undefined,
							};
						}
						// Handle regular string files
						return {
							file,
							data: data as string,
						};
					}),
					projectSettings: {
						framework: null,
						// outputDirectory: "/",
						// buildCommand: null,
					},
					target: "production",
				},
			});

			let domain: string | undefined = "";

			try {
				domain = await this.getProductionUrl(apiKey, deploymentName);
				console.log("Production domain:", domain);
			} catch (error) {
				console.error("Failed to get production domain:", error);
			}

			return {
				success: true,
				deployment: {
					id: response.id,
					name: deploymentName,
					// url: response.url ? `https://${response.url}` : "",
					url: domain,
					status: this.mapVercelStatus(response.readyState),
					createdAt: new Date(response.createdAt),
					updatedAt: new Date(response.createdAt),
					productionDomain: domain,
					settingsUrl: response.inspectorUrl
						? response.inspectorUrl.replace(/\/[^/]+$/, "/settings")
						: undefined,
				},
			};
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to create deployment",
			};
		}
	}

	async waitForDeploymentReady(
		apiKey: string,
		deploymentId: string,
	): Promise<void> {
		console.log(`🔄 Monitoring deployment: ${deploymentId}`);

		try {
			const vercel = this.getVercelInstance(apiKey);
			const deploymentInfo = await vercel.deployments.getDeployment({
				idOrUrl: deploymentId,
			});

			if (deploymentInfo.readyState === "READY") {
				console.log("✅ Deployment is already READY!");
				return;
			}

			if (deploymentInfo.readyState === "ERROR") {
				throw new Error("Deployment is in ERROR state");
			}

			if (deploymentInfo.readyState === "CANCELED") {
				throw new Error("Deployment is CANCELED");
			}
		} catch (error) {
			console.error("❌ Failed to get deployment info:", error);
			throw new Error(`Deployment not found: ${deploymentId}`);
		}

		return new Promise((resolve, reject) => {
			const eventsUrl = `https://api.vercel.com/v3/deployments/${deploymentId}/events?follow=1&builds=1`;

			const eventSource = fetch(eventsUrl, {
				headers: {
					Authorization: `Bearer ${apiKey}`,
					Accept: "application/stream+json",
				},
			});

			eventSource
				.then(async (response) => {
					if (!response.ok) {
						reject(
							new Error(
								`Failed to connect to events stream: ${response.status} ${response.statusText}`,
							),
						);
						return;
					}

					const reader = response.body?.getReader();

					if (!reader) {
						reject(new Error("No response body reader available"));
						return;
					}

					const decoder = new TextDecoder();
					let buffer = "";

					try {
						while (true) {
							const { done, value } = await reader.read();

							if (done) {
								break;
							}

							buffer += decoder.decode(value, { stream: true });

							const lines = buffer.split("\n");
							buffer = lines.pop() || "";

							for (const line of lines) {
								if (line.trim()) {
									try {
										const event = JSON.parse(line);

										if (
											event.text &&
											(event.text.includes("Deployment completed") ||
												event.text.includes("Build completed") ||
												event.text.includes("Ready!"))
										) {
											console.log(
												"✅ Deployment appears to be ready based on logs!",
											);
											reader.cancel();
											resolve();
											return;
										}

										if (
											event.text &&
											(event.text.includes("Build failed") ||
												event.text.includes("Error") ||
												event.text.includes("Failed"))
										) {
											console.log(
												"❌ Deployment appears to have failed based on logs!",
											);

											reader.cancel();
											reject(
												new Error("Deployment failed based on build logs"),
											);
											return;
										}
									} catch (error) {
										console.log("📝 Log:", error);
									}
								}
							}
						}
					} catch (error) {
						console.error("Stream reading error:", error);
						reject(error);
					}
				})
				.catch((error) => {
					reject(error);
				});

			setTimeout(
				() => {
					reject(new Error("Timeout waiting for deployment to be ready"));
				},
				2 * 60 * 1000,
			);
		});
	}

	async getCvData(
		apiKey: string,
		projectName: string,
	): Promise<FormData | null> {
		try {
			const domain = await this.getProductionUrl(apiKey, projectName);

			if (!domain) {
				console.warn(`No deployment found for project: ${projectName}`);
				return null;
			}

			// Fetch CV data directly from the deployed domain
			const cvDataUrl = `${domain}/cv-data.json`;
			const response = await fetch(cvDataUrl);

			if (!response.ok) {
				console.warn(
					`Failed to fetch CV data from ${cvDataUrl}:`,
					response.status,
				);
				return null;
			}

			const cvData = await response.json();

			if (cvData.generalInfo?.photo) {
				cvData.generalInfo.photo = buildPhotoUrl(
					domain,
					cvData.generalInfo.photo,
				);
			}

			return cvData;
		} catch (error) {
			console.error("Failed to get CV data:", error);
			return null;
		}
	}

	private async getProductionUrl(
		apiKey: string,
		projectName: string,
	): Promise<string> {
		try {
			const vercel = this.getVercelInstance(apiKey);
			const domains = await vercel.projects.getProjectDomains({
				idOrName: projectName,
				limit: 100,
			});

			// Find production domain (verified and not tied to a git branch)
			const productionDomain = domains.domains.find(
				(domain) =>
					domain.verified && !domain.gitBranch && !domain.customEnvironmentId,
			);

			if (productionDomain) {
				return `https://${productionDomain.name}`;
			}

			// Fallback to default vercel.app domain
			return `https://${projectName}.vercel.app`;
		} catch (error) {
			console.warn("Failed to get production domains, using fallback:", error);
			// Fallback to default vercel.app domain
			return `https://${projectName}.vercel.app`;
		}
	}

	private mapVercelStatus(
		vercelState: Deployments["state"],
	): "building" | "ready" | "error" | "canceled" {
		switch (vercelState) {
			case "BUILDING":
			case "INITIALIZING":
				return "building";
			case "READY":
				return "ready";
			case "ERROR":
				return "error";
			case "CANCELED":
				return "canceled";
			default:
				return "building";
		}
	}
}

export const vercelProvider = new VercelDeploymentProvider();
