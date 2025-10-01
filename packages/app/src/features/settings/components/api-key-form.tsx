import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormItem } from "@/components/form/form-item";
import { Button } from "@/components/ui/button";
import {
	type ApiKeyFormData,
	apiKeySchema,
} from "@/features/settings/api-key.schema";
import { useApiKeyStore } from "@/features/settings/api-key.store";
import FormProvider from "@/shared/providers/form-provider";

export const ApiKeyForm = forwardRef<HTMLDivElement>((_, ref) => {
	const { vercelApiKey, setVercelApiKey, clearVercelApiKey, validateApiKey } =
		useApiKeyStore();
	const [isValidating, setIsValidating] = useState(false);
	const [validationMessage, setValidationMessage] = useState<string | null>(
		null,
	);

	const form = useForm<ApiKeyFormData>({
		resolver: zodResolver(apiKeySchema),
		mode: "onSubmit",
		defaultValues: {
			vercelApiKey: vercelApiKey || "",
		},
	});

	const { handleSubmit, reset } = form;

	async function onSubmit(data: ApiKeyFormData) {
		setIsValidating(true);
		setValidationMessage(null);

		try {
			const isValid = await validateApiKey(data.vercelApiKey);

			if (isValid) {
				setVercelApiKey(data.vercelApiKey);
			} else {
				setValidationMessage(
					"Invalid API key. Please check your key and try again.",
				);
			}
		} catch {
			setValidationMessage("Failed to validate API key. Please try again.");
		} finally {
			setIsValidating(false);
		}
	}

	function handleClearApiKey() {
		clearVercelApiKey();
		reset({ vercelApiKey: "" });
	}

	return (
		<div className="px-5" ref={ref}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormProvider schema={apiKeySchema} {...form}>
					<FormItem
						className="mt-4"
						name="vercelApiKey"
						placeholder="Vercel Token"
						type="text"
						required
					/>
					{vercelApiKey ? (
						<Button
							type="button"
							variant="secondary"
							onClick={handleClearApiKey}
							className="w-full mt-2 text-red-600 hover:text-red-700"
						>
							Clear API Key
						</Button>
					) : (
						<Button
							variant="test"
							className="w-full mt-2"
							disabled={isValidating}
							type="submit"
						>
							<svg
								width="17"
								height="15"
								viewBox="0 0 17 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g clipPath="url(#clip0_334_95867)">
									<path
										d="M8.12188 0.859375L16.1939 14.8408H0.0498047L8.12188 0.859375Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_334_95867">
										<rect
											width="16.1441"
											height="14"
											fill="white"
											transform="translate(0.0498047 0.859375)"
										/>
									</clipPath>
								</defs>
							</svg>
							{isValidating ? "Validating..." : "Authenticate with Vercel"}
						</Button>
					)}
				</FormProvider>
				{validationMessage && (
					<div
						className={`text-sm p-3 rounded-md mt-4 ${
							validationMessage.includes("success")
								? "text-green-700 bg-green-50 border border-green-200"
								: "text-red-700 bg-red-50 border border-red-200"
						}`}
					>
						{validationMessage}
					</div>
				)}
				{!vercelApiKey && (
					<p className="text-center text-[13px] text-black/50 mt-2 tracking-tight">
						Don't have API key ? Get it from{" "}
						<a
							className="text-blue-600 hover:underline"
							href="https://vercel.com/account/tokens"
							target="_blank"
							rel="noopener noreferrer"
						>
							Vercel Dashboard
						</a>
						.
					</p>
				)}
			</form>
		</div>
	);
});

ApiKeyForm.displayName = "ApiKeyForm";
