import { renderRichTextContent } from "@quickcv/shared-utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Deployment } from "@/services/deployment/deployment-provider";
import { useProjectCvData } from "../hooks/use-project-cv-data";
import { ProjectMeta } from "./project-meta";

interface VercelProjectCardProps {
	deployment: Deployment;
	onEdit?: () => void;
}

function formatDeploymentDate(date: Date): string {
	const now = new Date();
	date = new Date(date);
	const isToday = date.toDateString() === now.toDateString();

	if (isToday) {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	}

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

function isValidCvData(cvData: unknown): cvData is NonNullable<typeof cvData> {
	if (!cvData || typeof cvData !== "object") return false;

	const data = cvData as { generalInfo?: { fullName?: string } };

	// Full name is required for valid CV data
	return !!data.generalInfo?.fullName?.trim();
}

interface VercelProjectCardLoadingProps {
	deployment: Deployment;
	onEdit?: () => void;
}

interface VercelProjectCardErrorProps {
	deployment: Deployment;
	onEdit?: () => void;
	onRetry?: () => void;
	errorMessage?: string;
}

function ErrorIcon() {
	return (
		<span className="text-xl font-medium bg-red-100 rounded-full size-6 flex items-center justify-center text-red-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="m12 12.727l-3.592 3.592q-.16.16-.354.15T7.7 16.3t-.16-.364q0-.203.16-.363L11.273 12L7.681 8.433q-.16-.16-.15-.364t.169-.363t.364-.16q.203 0 .363.16L12 11.298l3.567-3.592q.16-.16.354-.16t.354.16q.166.165.166.366t-.166.36L12.702 12l3.592 3.592q.16.16.16.354t-.16.354q-.165.166-.366.166t-.36-.166z"
				/>
			</svg>
		</span>
	);
}

function VercelProjectCardError({
	deployment,
	onEdit,
	onRetry,
	errorMessage = "Failed to load CV data",
}: VercelProjectCardErrorProps) {
	const deployedDate = formatDeploymentDate(deployment.createdAt);

	return (
		<div
			className="relative bg-white rounded-2xl"
			style={{
				boxShadow:
					"0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 8px 8px -4px rgba(0, 0, 0, 0.05)",
			}}
		>
			{/* Project Name Badge */}
			<div className="absolute -top-1.5 right-6 bg-neutral-700 text-white px-2 py-1.5 rounded-b-md rounded-tl-sm text-xs shadow-lg font-medium">
				<div style={{ textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)" }}>
					{deployment.name}
				</div>
				<div
					className="absolute top-0 right-0 translate-x-full bg-black h-1.5 w-2"
					style={{
						clipPath: "polygon(0 0, 0% 100%, 100% 100%)",
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="p-3.5 pb-0">
				<div className="flex flex-col items-center justify-center py-8 gap-3">
					<ErrorIcon />
					<div className="text-center">
						<p className="text-sm font-medium text-neutral-900">
							{errorMessage}
						</p>
						<p className="text-xs text-neutral-500 mt-1">
							The CV data could not be retrieved
						</p>
					</div>
					{onRetry && (
						<Button onClick={onRetry} variant="secondary">
							Retry
						</Button>
					)}
				</div>
			</div>

			{/* Footer Section */}
			<div className="bg-neutral-50 border-t border-black/5 pl-5 py-0 h-12 flex items-center justify-between rounded-b-[inherit] overflow-hidden">
				<span className="text-xs text-black/40 leading-tight tracking-tight">
					Updated {deployedDate}
				</span>
				<div className="flex items-center gap-0">
					<a
						href={`https://${deployment.domain}`}
						target="_blank"
						className="flex items-center gap-2.5 px-5 py-0 h-12  border-l border-black/5 text-sm font-medium text-black leading-tight tracking-tight hover:bg-black/5 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_447_46486)">
								<path
									d="M13.334 6.66927C13.334 4.15527 13.334 2.89794 12.5527 2.11727C11.7713 1.3366 10.5147 1.33594 8.00065 1.33594H6.66732C4.15332 1.33594 2.89598 1.33594 2.11532 2.11727C1.33465 2.8986 1.33398 4.15527 1.33398 6.66927V8.0026C1.33398 10.5166 1.33398 11.7739 2.11532 12.5546C2.82398 13.2639 3.92465 13.3293 6.00065 13.3359H6.33398"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9.68665 14.0413C8.58798 14.1173 7.49998 8.99464 8.24665 8.24797C8.99465 7.5013 14.1167 8.58797 14.04 9.68597C13.988 10.406 12.7707 10.69 12.8067 11.3293C12.8167 11.516 13.0533 11.6873 13.5267 12.028C13.8547 12.2653 14.19 12.4953 14.5133 12.7406C14.5751 12.7886 14.6216 12.8536 14.6468 12.9277C14.672 13.0017 14.675 13.0816 14.6553 13.1573C14.5675 13.5208 14.3811 13.8529 14.1167 14.1173C13.8523 14.3817 13.5201 14.5681 13.1567 14.656C13.0809 14.6756 13.0011 14.6727 12.927 14.6474C12.853 14.6222 12.7879 14.5758 12.74 14.514C12.4953 14.1906 12.2653 13.8553 12.028 13.5273C11.6867 13.054 11.516 12.8173 11.3287 12.8073C10.69 12.7713 10.4053 13.9886 9.68598 14.0406M1.33398 4.66797H13.334"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_447_46486">
									<rect width="16" height="16" fill="white" />
								</clipPath>
							</defs>
						</svg>

						<span className="w-12 text-left">Preview</span>
					</a>
					<button
						onClick={onEdit}
						className="flex items-center gap-1.5 px-5 py-0 h-12 text-sm  border-l border-black/5 font-medium text-black leading-tight tracking-tight hover:bg-black/5 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.142 3.98508L11.0767 3.05108C11.3245 2.80328 11.6606 2.66406 12.011 2.66406C12.3615 2.66406 12.6975 2.80328 12.9453 3.05108C13.1932 3.29888 13.3324 3.63497 13.3324 3.98541C13.3324 4.33585 13.1932 4.67194 12.9453 4.91974L12.0113 5.85441M10.142 3.98508L4.65268 9.47441C3.95602 10.1717 3.60735 10.5197 3.37002 10.9444C3.13268 11.3691 2.89402 12.3711 2.66602 13.3304C3.62468 13.1024 4.62735 12.8637 5.05202 12.6264C5.47668 12.3891 5.82535 12.0404 6.52202 11.3437L12.0113 5.85441M10.142 3.98508L12.0113 5.85441M7.33268 13.3304H11.3327"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Edit
					</button>
				</div>
			</div>
		</div>
	);
}

function VercelProjectCardLoading({
	deployment,
	onEdit,
}: VercelProjectCardLoadingProps) {
	const deployedDate = formatDeploymentDate(deployment.createdAt);

	return (
		<div
			className="relative bg-white rounded-2xl"
			style={{
				boxShadow:
					"0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 8px 8px -4px rgba(0, 0, 0, 0.05)",
			}}
		>
			{/* Project Name Badge */}
			<div className="absolute -top-1.5 right-6 bg-neutral-700 text-white px-2 py-1.5 rounded-b-md rounded-tl-sm text-xs shadow-lg font-medium">
				<div style={{ textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)" }}>
					{deployment.name}
				</div>
				<div
					className="absolute top-0 right-0 translate-x-full bg-black h-1.5 w-2"
					style={{
						clipPath: "polygon(0 0, 0% 100%, 100% 100%)",
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="p-3.5 pb-0">
				{/* Header Section */}
				<div className="flex items-start gap-3.5 mb-3">
					<Skeleton className="w-14 h-14 rounded-2xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
					<div className="flex-1 min-w-0">
						<Skeleton className="h-4 w-40 rounded" />
						<div className="flex items-center gap-1.5 mt-1">
							<Skeleton className="h-3 w-32 rounded" />
						</div>
						<div className="flex items-center gap-1 mt-1 flex-wrap">
							<Skeleton className="h-3 w-24 rounded" />
							<span className="text-xs text-black/60 leading-tight tracking-tight">
								•
							</span>
							<Skeleton className="h-3 w-20 rounded" />
						</div>
					</div>
				</div>

				{/* Description Section */}
				<div className=" relative">
					<div className="max-h-[120px] overflow-hidden">
						<div className="space-y-2 pb-4">
							<Skeleton className="h-3 w-full rounded" />
							<Skeleton className="h-3 w-11/12 rounded" />
							<Skeleton className="h-3 w-4/5 rounded" />
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-[80%] bg-gradient-to-t from-white to-transparent via-transparent pointer-events-none" />
				</div>
			</div>

			{/* Footer Section */}
			<div className="bg-neutral-50 border-t border-black/5 pl-5 py-0 h-12 flex items-center justify-between rounded-b-[inherit] overflow-hidden">
				<span className="text-xs text-black/40 leading-tight tracking-tight">
					Updated {deployedDate}
				</span>
				<div className="flex items-center gap-0">
					<a
						href={`https://${deployment.domain}`}
						target="_blank"
						className="flex items-center gap-2.5 px-5 py-0 h-12  border-l border-black/5 text-sm font-medium text-black leading-tight tracking-tight hover:bg-black/5 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_447_46486)">
								<path
									d="M13.334 6.66927C13.334 4.15527 13.334 2.89794 12.5527 2.11727C11.7713 1.3366 10.5147 1.33594 8.00065 1.33594H6.66732C4.15332 1.33594 2.89598 1.33594 2.11532 2.11727C1.33465 2.8986 1.33398 4.15527 1.33398 6.66927V8.0026C1.33398 10.5166 1.33398 11.7739 2.11532 12.5546C2.82398 13.2639 3.92465 13.3293 6.00065 13.3359H6.33398"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9.68665 14.0413C8.58798 14.1173 7.49998 8.99464 8.24665 8.24797C8.99465 7.5013 14.1167 8.58797 14.04 9.68597C13.988 10.406 12.7707 10.69 12.8067 11.3293C12.8167 11.516 13.0533 11.6873 13.5267 12.028C13.8547 12.2653 14.19 12.4953 14.5133 12.7406C14.5751 12.7886 14.6216 12.8536 14.6468 12.9277C14.672 13.0017 14.675 13.0816 14.6553 13.1573C14.5675 13.5208 14.3811 13.8529 14.1167 14.1173C13.8523 14.3817 13.5201 14.5681 13.1567 14.656C13.0809 14.6756 13.0011 14.6727 12.927 14.6474C12.853 14.6222 12.7879 14.5758 12.74 14.514C12.4953 14.1906 12.2653 13.8553 12.028 13.5273C11.6867 13.054 11.516 12.8173 11.3287 12.8073C10.69 12.7713 10.4053 13.9886 9.68598 14.0406M1.33398 4.66797H13.334"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_447_46486">
									<rect width="16" height="16" fill="white" />
								</clipPath>
							</defs>
						</svg>

						<span className="w-12 text-left">Preview</span>
					</a>
					<button
						onClick={onEdit}
						className="flex items-center gap-1.5 px-5 py-0 h-12 text-sm  border-l border-black/5 font-medium text-black leading-tight tracking-tight hover:bg-black/5 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.142 3.98508L11.0767 3.05108C11.3245 2.80328 11.6606 2.66406 12.011 2.66406C12.3615 2.66406 12.6975 2.80328 12.9453 3.05108C13.1932 3.29888 13.3324 3.63497 13.3324 3.98541C13.3324 4.33585 13.1932 4.67194 12.9453 4.91974L12.0113 5.85441M10.142 3.98508L4.65268 9.47441C3.95602 10.1717 3.60735 10.5197 3.37002 10.9444C3.13268 11.3691 2.89402 12.3711 2.66602 13.3304C3.62468 13.1024 4.62735 12.8637 5.05202 12.6264C5.47668 12.3891 5.82535 12.0404 6.52202 11.3437L12.0113 5.85441M10.142 3.98508L12.0113 5.85441M7.33268 13.3304H11.3327"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Edit
					</button>
				</div>
			</div>
		</div>
	);
}

export function VercelProjectCard({
	deployment,
	onEdit,
}: VercelProjectCardProps) {
	const { cvData, isLoading, error, refetch } = useProjectCvData({
		projectName: deployment.name,
	});

	if (isLoading) {
		return <VercelProjectCardLoading deployment={deployment} onEdit={onEdit} />;
	}

	if (error || !isValidCvData(cvData)) {
		return (
			<VercelProjectCardError
				deployment={deployment}
				onEdit={onEdit}
				onRetry={() => refetch()}
				errorMessage={error ? "Failed to load CV data" : "No CV data found"}
			/>
		);
	}

	const displayName = cvData.generalInfo?.fullName;
	const deployedDate = formatDeploymentDate(deployment.createdAt);
	const experienceCount = cvData.experience?.experiences.length || 0;
	const educationCount = cvData.education.education?.length || 0;
	const cvDescription = cvData.generalInfo?.about
		? renderRichTextContent(cvData.generalInfo.about)
		: null;
	const professionalTitle = cvData.generalInfo?.professionalTitle;

	return (
		<div
			className="relative bg-white rounded-2xl"
			style={{
				boxShadow:
					"0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 8px 8px -4px rgba(0, 0, 0, 0.05)",
			}}
		>
			{/* Project Name Badge */}
			<div className="absolute -top-1.5 right-6 bg-neutral-700 text-white px-2 py-1.5 rounded-b-md rounded-tl-sm text-xs shadow-lg font-medium">
				<div style={{ textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)" }}>
					{deployment.name}
				</div>
				<div
					className="absolute top-0 right-0 translate-x-full bg-black h-1.5 w-2"
					style={{
						clipPath: "polygon(0 0, 0% 100%, 100% 100%)",
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="p-3.5 pb-0">
				{/* Header Section */}
				<div className="flex items-start gap-3.5 mb-3">
					{cvData?.generalInfo?.photo ? (
						<img
							src={cvData.generalInfo.photo}
							alt={displayName}
							className="aspect-square w-14 object-cover rounded-2xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
						/>
					) : null}

					{/* User Info */}
					<div className="flex-1 min-w-0">
						{displayName ? (
							<h3 className="font-medium text-lg text-black leading-tight tracking-tight">
								{displayName}
							</h3>
						) : null}
						<div className="flex items-center gap-1.5 mt-0.5">
							{professionalTitle ? (
								<p className="text-sm text-neutral-600 leading-tight tracking-tight">
									{professionalTitle}
								</p>
							) : null}
						</div>
						<div className="flex items-center gap-1 mt-0.5 flex-wrap">
							{isLoading ? (
								<>
									<Skeleton className="h-3 w-24 rounded" />
									<span className="text-xs text-black/60 leading-tight tracking-tight">
										•
									</span>
									<Skeleton className="h-3 w-20 rounded" />
								</>
							) : (
								<>
									<span className="text-sm text-neutral-600 leading-tight tracking-tight">
										{experienceCount} experience
									</span>
									<span className="text-xs text-black/60 leading-tight tracking-tight">
										•
									</span>
									<span className="text-sm text-neutral-600 leading-tight tracking-tight">
										{educationCount} education
									</span>
								</>
							)}
						</div>

						{!isLoading && (
							<ProjectMeta
								template={cvData?.template}
								analyticsType={cvData?.analytics?.type}
								className="mt-1"
							/>
						)}
					</div>
				</div>

				{/* Description Section */}
				<div className=" relative">
					<div className="max-h-[120px] overflow-hidden">
						{isLoading ? (
							<div className="space-y-2 pb-4">
								<Skeleton className="h-3 w-full rounded" />
								<Skeleton className="h-3 w-11/12 rounded" />
								<Skeleton className="h-3 w-4/5 rounded" />
							</div>
						) : (
							<div className="text-sm text-black/90 leading-relaxed tracking-tight pb-4">
								{cvDescription}
							</div>
						)}
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-[80%] bg-gradient-to-t from-white to-transparent via-transparent pointer-events-none" />
				</div>
			</div>

			{/* Footer Section */}
			<div className="bg-neutral-50 border-t border-black/5 pl-5 py-0 h-12 flex items-center justify-between rounded-b-[inherit] overflow-hidden">
				<span className="text-xs text-black/40 leading-tight tracking-tight">
					Updated {deployedDate}
				</span>
				<div className="flex items-center gap-0">
					<a
						href={`https://${deployment.domain}`}
						target="_blank"
						className="flex items-center gap-2.5 px-5 py-0 h-12  border-l border-black/5 text-sm font-medium text-black leading-tight tracking-tight hover:bg-black/5 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_447_46486)">
								<path
									d="M13.334 6.66927C13.334 4.15527 13.334 2.89794 12.5527 2.11727C11.7713 1.3366 10.5147 1.33594 8.00065 1.33594H6.66732C4.15332 1.33594 2.89598 1.33594 2.11532 2.11727C1.33465 2.8986 1.33398 4.15527 1.33398 6.66927V8.0026C1.33398 10.5166 1.33398 11.7739 2.11532 12.5546C2.82398 13.2639 3.92465 13.3293 6.00065 13.3359H6.33398"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9.68665 14.0413C8.58798 14.1173 7.49998 8.99464 8.24665 8.24797C8.99465 7.5013 14.1167 8.58797 14.04 9.68597C13.988 10.406 12.7707 10.69 12.8067 11.3293C12.8167 11.516 13.0533 11.6873 13.5267 12.028C13.8547 12.2653 14.19 12.4953 14.5133 12.7406C14.5751 12.7886 14.6216 12.8536 14.6468 12.9277C14.672 13.0017 14.675 13.0816 14.6553 13.1573C14.5675 13.5208 14.3811 13.8529 14.1167 14.1173C13.8523 14.3817 13.5201 14.5681 13.1567 14.656C13.0809 14.6756 13.0011 14.6727 12.927 14.6474C12.853 14.6222 12.7879 14.5758 12.74 14.514C12.4953 14.1906 12.2653 13.8553 12.028 13.5273C11.6867 13.054 11.516 12.8173 11.3287 12.8073C10.69 12.7713 10.4053 13.9886 9.68598 14.0406M1.33398 4.66797H13.334"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_447_46486">
									<rect width="16" height="16" fill="white" />
								</clipPath>
							</defs>
						</svg>

						<span className="w-12 text-left">Preview</span>
					</a>
					<button
						onClick={onEdit}
						className="flex items-center gap-1.5 px-5 py-0 h-12 text-sm  border-l border-black/5 font-medium text-black leading-tight tracking-tight hover:bg-black/5 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.142 3.98508L11.0767 3.05108C11.3245 2.80328 11.6606 2.66406 12.011 2.66406C12.3615 2.66406 12.6975 2.80328 12.9453 3.05108C13.1932 3.29888 13.3324 3.63497 13.3324 3.98541C13.3324 4.33585 13.1932 4.67194 12.9453 4.91974L12.0113 5.85441M10.142 3.98508L4.65268 9.47441C3.95602 10.1717 3.60735 10.5197 3.37002 10.9444C3.13268 11.3691 2.89402 12.3711 2.66602 13.3304C3.62468 13.1024 4.62735 12.8637 5.05202 12.6264C5.47668 12.3891 5.82535 12.0404 6.52202 11.3437L12.0113 5.85441M10.142 3.98508L12.0113 5.85441M7.33268 13.3304H11.3327"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Edit
					</button>
				</div>
			</div>
		</div>
	);
}
