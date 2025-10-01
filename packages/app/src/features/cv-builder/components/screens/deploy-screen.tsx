import { zodResolver } from "@hookform/resolvers/zod";
import { renderTemplateToHTML } from "@quickcv/templates";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import React, { type PropsWithChildren, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormItem } from "@/components/form/form-item";
import FormLabel, { formLabelVariants } from "@/components/form/form-label";
import { inputVariants } from "@/components/form/widgets/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDeployments } from "@/features/projects/hooks/use-deployments";
import { useApiKeyStore } from "@/features/settings/api-key.store";
import { SettingsModal } from "@/features/settings/components/settings-modal";
import { useSequentialState } from "@/hooks/use-sequential-state";
import { buildPhotoUrl, processPhoto } from "@/lib/photo-utils";
import {
	type DeploymentResult,
	deploymentProviders,
} from "@/services/deployment";
import FormProvider from "@/shared/providers/form-provider";
import type { DeployFormData } from "../../config";
import { deployFormSchema } from "../../config";
import { useCvFormStore } from "../../provider/cv-form-provider";
import type { FormData } from "../../store/form-store";
import { blobToBase64 } from "../../utils/blob-to-base64";
import { buildDeploymentConfig } from "../../utils/deployment-builder";
import { generatePDFBlob } from "../../utils/pdf-generator";
import { AnalyticsSection } from "../analytics/analytics-section";
import { DeploymentSuccessModal } from "../deployment-success-modal";
import { ScreenContent } from "../ui/screen-content";
import { ScreenHeader } from "../ui/screen-header";

// Helper Functions
function generateDefaultTitle(
	fullName: string,
	professionalTitle: string,
): string {
	if (fullName && professionalTitle) {
		return `${fullName} - ${professionalTitle}`;
	}
	return fullName || professionalTitle || "";
}

// Components with complex logic
interface DeployButtonProps extends React.ComponentProps<typeof Button> {
	isDeploying: boolean;
	onDeploy: () => void;
	deploymentStep?: string;
}

function DeployButton({
	isDeploying,
	onDeploy,
	deploymentStep,
	children,
	...rest
}: PropsWithChildren<DeployButtonProps>) {
	return (
		<Button
			variant="test"
			shadow="xl"
			onClick={onDeploy}
			disabled={isDeploying}
			className="overflow-hidden"
			{...rest}
		>
			<AnimatePresence mode="wait" initial={false}>
				{isDeploying ? (
					<motion.div
						key="deploying"
						initial={{ y: -10, opacity: 0, filter: "blur(2px)" }}
						animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
						exit={{ y: 10, opacity: 0, filter: "blur(2px)" }}
						transition={{ duration: 0.25 }}
						className="flex items-center gap-2"
					>
						<AnimatePresence mode="popLayout">
							<motion.span
								key={deploymentStep}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
								transition={{ duration: 0.25 }}
								className="relative overflow-hidden"
							>
								<motion.span
									className="relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [background-repeat:no-repeat,padding-box]"
									initial={{ backgroundPosition: "100% center" }}
									animate={{ backgroundPosition: "-50% center" }}
									transition={{
										repeat: Number.POSITIVE_INFINITY,
										duration: 1,
										repeatDelay: 0.2,
										ease: "linear",
									}}
									style={
										{
											"--spread": "50px",
											backgroundImage:
												"linear-gradient(90deg, transparent calc(50% - var(--spread)), white, transparent calc(50% + var(--spread))), linear-gradient(#ffffff80, #ffffff80)",
										} as React.CSSProperties
									}
								>
									{deploymentStep || "Deploying..."}
								</motion.span>
							</motion.span>
						</AnimatePresence>
					</motion.div>
				) : (
					<motion.div
						key="deploy"
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="flex items-center gap-2"
					>
						<svg
							viewBox="0 0 256 222"
							className="w-3.5"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid"
						>
							<path fill="#fff" d="m128 0 128 221.705H0z" />
						</svg>
						{children ?? "Deploy to Vercel"}
					</motion.div>
				)}
			</AnimatePresence>
		</Button>
	);
}

interface BasicFormFieldsProps {
	isApiKeyConfigured: boolean;
	onOpenSettings: () => void;
	editMode: boolean;
}

function BasicFormFields({
	isApiKeyConfigured,
	onOpenSettings,
	editMode,
}: BasicFormFieldsProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<FormItem
					name="projectName"
					type="text"
					label="Project Name"
					placeholder="my-portfolio"
					disabled={editMode}
				/>
			</div>

			<div className="space-y-3">
				<FormItem name="title" type="text" label="Site Title" />
			</div>

			{!isApiKeyConfigured && (
				<div className="space-y-3 text-left">
					<button
						onClick={onOpenSettings}
						className="w-full flex flex-col text-left"
						type="button"
					>
						<FormLabel required>Vercel Token</FormLabel>
						<span
							className={`${inputVariants({ invalid: false })} } text-left text-black w-full mt-1`}
						>
							Configure your Vercel Token
						</span>
					</button>
				</div>
			)}

			{isApiKeyConfigured && (
				<div className="">
					<span className={formLabelVariants()}>Vercel Token</span>
					<div className="rounded-xl bg-[#FAFFFD] p-2.5 shadow-input mt-1">
						<div className="flex items-center space-x-2">
							<svg
								width="19"
								height="18"
								viewBox="0 0 19 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.8244 2.7C10.0249 1.899 9.62443 1.5 9.12793 1.5C8.63143 1.5 8.23093 1.89975 7.43143 2.7C6.95143 3.18 6.47593 3.402 5.79193 3.402C5.19493 3.402 4.34443 3.2865 3.87793 3.75675C3.41443 4.224 3.52993 5.07075 3.52993 5.664C3.52993 6.348 3.30718 6.8235 2.82718 7.3035C2.02768 8.103 1.62793 8.5035 1.62793 9C1.62793 9.4965 2.02768 9.897 2.82793 10.6965C3.36493 11.2343 3.52993 11.5815 3.52993 12.336C3.52993 12.933 3.41443 13.7835 3.88468 14.25C4.35193 14.7128 5.19868 14.598 5.79193 14.598C6.52018 14.598 6.87193 14.7405 7.39168 15.2603C7.83418 15.7028 8.42743 16.5 9.12793 16.5C9.82843 16.5 10.4217 15.7028 10.8642 15.2603C11.3847 14.7405 11.7357 14.598 12.4639 14.598C13.0572 14.598 13.9039 14.7135 14.3712 14.25M14.3712 14.25C14.8414 13.7835 14.7259 12.933 14.7259 12.336C14.7259 11.5815 14.8909 11.2343 15.4279 10.6965C16.2282 9.897 16.6279 9.4965 16.6279 9C16.6279 8.5035 16.2282 8.103 15.4287 7.3035M14.3712 14.25H14.3779"
									stroke="#118862"
									strokeWidth="1.25"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M6.12793 7.731C6.12793 7.731 7.81543 7.5 9.12793 10.5C9.12793 10.5 12.9222 3 16.6279 1.5"
									stroke="#118862"
									strokeWidth="1.25"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>

							<span className="text-sm text-emerald-800">
								Vercel API Key Configured
							</span>
							<button
								type="button"
								onClick={onOpenSettings}
								className="text-xs text-emerald-700 hover:underline ml-auto"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

interface DeploymentResultProps {
	result: DeployResult;
}

function DeploymentResultK({ result }: DeploymentResultProps) {
	if (result.success) {
		return null;
	}

	return (
		<div className="rounded-lg border border-red-200 bg-red-50 p-4">
			<div className="flex items-center space-x-2">
				<div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
					<svg
						className="h-3 w-3 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-medium text-red-900">Deployment Failed</h3>
			</div>
			<p className="mt-2 text-sm text-red-700">{result.error}</p>
		</div>
	);
}

interface DeployResult {
	success: boolean;
	url?: string;
	error?: string;
	projectSettingsUrl?: string;
	vercelOwner?: string;
	vercelProject?: string;
}

async function generatePDFForDeployment(
	data: FormData,
): Promise<string | undefined> {
	try {
		const pdfBlob = await generatePDFBlob(data);
		const base64 = await blobToBase64(pdfBlob);

		if (pdfBlob.size === 0) {
			throw new Error("Generated PDF blob is empty");
		}

		if (pdfBlob.type !== "application/pdf") {
			console.warn("⚠️ PDF blob type is unexpected:", pdfBlob.type);
		}

		return base64;
	} catch (pdfError) {
		console.warn("❌ PDF generation failed:", pdfError);
	}
}

// Main Component
export function DeployScreen() {
	const store = useCvFormStore();

	const wizardData = store.formData;
	const editMode = store.editMode ?? false;
	const projectName = store.projectName;
	const { vercelApiKey, isConfigured } = useApiKeyStore();
	const queryClient = useQueryClient();

	const { deployments } = useDeployments();
	const [isDeploying, setIsDeploying] = useState(false);
	const [deployResult, setDeployResult] = useState<DeployResult | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [currentDeploymentStep, setCurrentDeploymentStep] =
		useSequentialState<string>("", 1000);
	const [successModalData, setSuccessModalData] = useState<{
		url?: string;
		projectSettingsUrl?: string;
	}>({});

	const form = useForm<DeployFormData>({
		resolver: zodResolver(deployFormSchema),
		defaultValues: {
			projectName: editMode === true && projectName ? projectName : "",
			title: generateDefaultTitle(
				wizardData.generalInfo.fullName,
				wizardData.generalInfo.professionalTitle,
			),
			template: wizardData.template as
				| "minimal"
				| "modern"
				| "professional"
				| "coolest",
			analytics: wizardData.analytics || "none",
		},
	});

	useEffect(() => {
		const sub = form.watch((data) => {
			if (data.analytics) {
				store.updateAnalytics(data.analytics);
			}
			if (data.template) {
				store.updateTemplate(data.template);
			}
		});
		return () => sub.unsubscribe();
	}, [form.watch, store.updateAnalytics, store.updateTemplate]);

	// Update form when edit mode changes
	useEffect(() => {
		if (editMode === true && projectName) {
			form.setValue("projectName", projectName);
		}
	}, [editMode, projectName, form]);

	const analyticsType = form.watch("analytics.type");
	const selectedTemplate = form.watch("template");

	function handleDeploymentResult(
		deploymentResult: DeploymentResult,
		validation: { userInfo?: { username: string } },
		formData: { projectName: string },
		data: FormData,
	) {
		console.log("update deployment result", data, deploymentResult);
		if (!deploymentResult.success || !deploymentResult.deployment) {
			return setDeployResult({
				success: false,
				error: deploymentResult.error || "Deployment failed",
			});
		}

		let deployedPhotoUrl = null;

		if (data.generalInfo.photo) {
			deployedPhotoUrl = buildPhotoUrl(
				deploymentResult.deployment.url,
				data.generalInfo.photo,
			);
		}

		const successData = {
			success: true,
			url: deploymentResult.deployment.url,
			projectSettingsUrl: deploymentResult.deployment.settingsUrl,
			vercelOwner: validation.userInfo?.username,
			vercelProject: formData.projectName,
		};
		setDeployResult(successData);

		setSuccessModalData({
			url: deploymentResult.deployment.url,
			projectSettingsUrl: deploymentResult.deployment.settingsUrl,
		});
		setShowSuccessModal(true);

		const newData = Object.assign({}, data, {
			generalInfo: {
				...data.generalInfo,
				photo: deployedPhotoUrl,
			},
		});

		if (!editMode) {
			const currentDeployments = deployments || [];
			const newDeployment = deploymentResult.deployment;
			const updatedDeployments = [newDeployment, ...currentDeployments];

			queryClient.setQueryData(
				["deployments", vercelApiKey],
				updatedDeployments,
			);
		}

		queryClient.setQueryData(
			["project-cv-data", formData.projectName],
			newData,
		);
	}

	async function handleDeploy() {
		setIsDeploying(true);
		setDeployResult(null);
		setCurrentDeploymentStep("Authenticating...");

		try {
			const formData = form.getValues();
			const provider = deploymentProviders.vercel;
			const apiKey = vercelApiKey ? vercelApiKey : formData.vercelToken;

			if (!apiKey) {
				setDeployResult({
					success: false,
					error:
						"Vercel API key is required. Please configure it in settings or enter it above.",
				});
				return;
			}

			const validation = await provider.validateApiKey(apiKey);

			if (!validation.isValid) {
				setDeployResult({
					success: false,
					error: validation.error || "Invalid API key",
				});
				return;
			}

			setCurrentDeploymentStep("Preparing your CV...");

			const pdfBase64 = await generatePDFForDeployment(wizardData);

			setCurrentDeploymentStep("Bundling files...");

			const photoProcessingResult = await processPhoto(
				wizardData.generalInfo.photo || null,
			);

			const dataWithProcessedPhoto = {
				...wizardData,
				analytics: form.getValues("analytics"),
				template: selectedTemplate || "minimal",
				generalInfo: {
					...wizardData.generalInfo,
					photo: photoProcessingResult.photoPath,
				},
			};

			const templateHTML = await renderTemplateToHTML({
				data: dataWithProcessedPhoto,
				templateKey: selectedTemplate || "minimal",
			});

			const files: Record<string, string | { data: string; encoding: string }> =
				{
					"index.html": templateHTML,
					"cv-data.json": JSON.stringify(dataWithProcessedPhoto),
				};

			// Add PDF if generated
			if (pdfBase64) {
				const { createPDFFilename } = await import("@quickcv/shared-utils");
				files[createPDFFilename(wizardData.generalInfo.fullName, "CV")] = {
					data: pdfBase64,
					encoding: "base64",
				};
			}

			// Add photo if processed
			if (
				photoProcessingResult.photoBase64 &&
				photoProcessingResult.photoFilename
			) {
				files[photoProcessingResult.photoFilename] = {
					data: photoProcessingResult.photoBase64.split(",")[1], // Remove data:image/jpeg;base64, prefix
					encoding: "base64",
				};
			}

			const deploymentConfig = await buildDeploymentConfig({
				formData,
				files,
			});

			setCurrentDeploymentStep("Uploading to Vercel...");

			const deploymentResult = await provider.createDeployment(
				apiKey,
				deploymentConfig,
			);

			if (deploymentResult.success && deploymentResult.deployment) {
				setCurrentDeploymentStep("Building your site...");

				await provider.waitForDeploymentReady(
					apiKey,
					deploymentResult.deployment.id,
				);

				setCurrentDeploymentStep("Publishing...");
			}

			handleDeploymentResult(
				deploymentResult,
				validation,
				formData,
				dataWithProcessedPhoto,
			);
		} catch (error) {
			console.error("❌ Deployment failed:", error);
			setDeployResult({
				success: false,
				error: error instanceof Error ? error.message : "Deployment failed",
			});
		} finally {
			setCurrentDeploymentStep("");
			setIsDeploying(false);
		}
	}

	return (
		<>
			<ScreenHeader
				title={editMode ? "Update Deployment" : "Deployment"}
				className="flex-1"
			>
				<div className="flex items-center gap-2">
					<DeployButton
						isDeploying={isDeploying}
						deploymentStep={currentDeploymentStep}
						onDeploy={() => handleDeploy()}
						disabled={isDeploying}
					>
						{editMode ? "Update Deployment" : "Deploy to Vercel"}
					</DeployButton>
				</div>
			</ScreenHeader>
			<ScreenContent key="deploy-content">
				<FormProvider schema={deployFormSchema} {...form}>
					<form
						onSubmit={form.handleSubmit(handleDeploy)}
						className="space-y-6"
					>
						<BasicFormFields
							isApiKeyConfigured={isConfigured}
							onOpenSettings={() => setShowSettings(true)}
							editMode={editMode}
						/>
						<Divider />

						{/* Template Selector */}
						{/* <TemplateSelector
							selectedTemplate={selectedTemplate}
							onTemplateSelect={(template) =>
								form.setValue("template", template)
							}
						/> */}
						{/* <Divider /> */}

						<AnalyticsSection analyticsType={analyticsType} />
						{deployResult && !deployResult.success && (
							<div className="pt-6">
								<DeploymentResultK result={deployResult} />
							</div>
						)}
					</form>
				</FormProvider>
			</ScreenContent>

			<Dialog open={showSettings} onOpenChange={setShowSettings}>
				<SettingsModal
					isOpen={showSettings}
					onClose={() => setShowSettings(false)}
				/>
			</Dialog>
			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
				<DeploymentSuccessModal
					isOpen={showSuccessModal}
					onClose={() => setShowSuccessModal(false)}
					url={successModalData.url}
					projectSettingsUrl={successModalData.projectSettingsUrl}
				/>
			</Dialog>
		</>
	);
}

const Divider = () => {
	return <div className="h-px bg-gray-200" />;
};

export default DeployScreen;
