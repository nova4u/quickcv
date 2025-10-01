import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/deployment-success")({
	component: DeploymentSuccessRoute,
});

const mockDeployment = {
	id: "dep_abc123xyz",
	name: "john-doe-cv",
	url: "https://john-doe-cv.vercel.app",
	status: "ready" as const,
	createdAt: new Date("2024-01-15T10:30:00Z"),
	provider: "Vercel",
	template: "Modern Template",
	pdfUrl: "https://john-doe-cv.vercel.app/john-doe-cv.pdf",
	lastUpdated: new Date("2024-01-15T10:28:00Z"),
};

function DeploymentSuccessRoute() {
	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
			{/* Modal Overlay */}
			<div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40" />

			{/* Modal Content */}
			<Card className="relative z-50 w-full max-w-md mx-auto bg-white dark:bg-neutral-800 shadow-2xl border-0">
				<div className="p-6">
					{/* Header */}
					<div className="text-center mb-6">
						{/* Success Icon */}
						<div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
							<svg
								className="w-8 h-8 text-green-600 dark:text-green-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>

						<h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
							Deployment Successful!
						</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Your CV has been deployed and is now live
						</p>
					</div>

					{/* Deployment Details */}
					<div className="space-y-4 mb-6">
						{/* URL Display */}
						<div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
							<div className="flex items-center justify-between">
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
										Live URL
									</p>
									<p className="text-sm font-mono text-neutral-900 dark:text-neutral-100 truncate">
										{mockDeployment.url}
									</p>
								</div>
								<Button
									variant="secondary"
									size="sm"
									className="ml-2 h-8 w-8 p-0 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
								</Button>
							</div>
						</div>

						{/* Deployment Info Grid */}
						<div className="grid grid-cols-2 gap-3">
							<div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
								<p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
									Template
								</p>
								<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
									{mockDeployment.template}
								</p>
							</div>

							<div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
								<p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
									Last Updated
								</p>
								<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
									{mockDeployment.lastUpdated.toLocaleDateString()}
								</p>
							</div>

							<div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600 col-span-2">
								<p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
									PDF Download
								</p>
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 font-mono text-xs truncate">
										Available
									</p>
									<Button variant="secondary" size="xs" className="ml-2">
										<svg
											className="w-3 h-3 mr-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										PDF
									</Button>
								</div>
							</div>
						</div>

						{/* Status Badge */}
						<div className="flex items-center justify-center">
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
								<span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2" />
								Live and Ready
							</span>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900">
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							View Live Site
						</Button>

						<div className="grid grid-cols-2 gap-3">
							<Button variant="secondary" size="sm">
								Copy Link
							</Button>
							<Button variant="secondary" size="sm">
								Share
							</Button>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-600">
						<p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
							Deployed at {mockDeployment.createdAt.toLocaleString()}
						</p>
					</div>
				</div>

				{/* Close Button */}
				<button className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300">
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</Card>
		</div>
	);
}
