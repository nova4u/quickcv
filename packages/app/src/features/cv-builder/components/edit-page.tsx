import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { DocumentLoader } from "@/components/ui/document-loader";
import { NotFoundDocument } from "@/components/ui/not-found-document";
import { useDeployments } from "@/features/projects/hooks/use-deployments";
import { useProjectCvData } from "@/features/projects/hooks/use-project-cv-data";
import { EditCvBuilder } from "./edit-cv-builder";

interface EditPageProps {
	projectName: string;
	className?: string;
}

export default function EditPage({ projectName, className }: EditPageProps) {
	const {
		deployments,
		isLoading: deploymentsLoading,
		error: deploymentsError,
	} = useDeployments();

	const {
		cvData,
		isLoading: cvDataLoading,
		error: cvDataError,
	} = useProjectCvData({
		projectName,
	});

	// Find the deployment by project name
	const deployment = deployments.find((d) => d.name === projectName);

	// Handle loading state
	if (deploymentsLoading || cvDataLoading) {
		return <DocumentLoader text="Loading project..." className={className} />;
	}

	// Handle error state
	if (deploymentsError || cvDataError) {
		return (
			<div className={className}>
				<div className="flex items-center justify-center py-16">
					<div className="text-center">
						<div className="text-red-500 mb-4">
							<svg
								className="h-12 w-12 mx-auto"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Failed to load project
						</h2>
						<p className="text-gray-600">
							Unable to load project data. Please try again.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!deployment) {
		return (
			<div
				className={
					"max-w-6xl mx-auto px-4 md:text-center my-2	0 md:-mt-20 md:self-center"
				}
			>
				<NotFoundDocument className={"pb-6 "} />
				<h2 className="font-medium text-gray-900 mb-2">Project not found</h2>
				<p className="text-gray-600 mb-4 text-sm">
					The project "{projectName}" could not be found.
				</p>
				<Link to="/" className={`${buttonVariants({ variant: "test" })}`}>
					Create New CV
				</Link>
				<Link
					to="/dashboard"
					className={`${buttonVariants({ variant: "secondary" })} ml-4`}
				>
					Go to Dashboard
				</Link>
			</div>
		);
	}

	if (!cvData) {
		return (
			<div>
				<NotFoundDocument />
				<h2 className="text-xl font-medium text-gray-900 mb-2">
					No data available
				</h2>
				<p className="text-gray-600 mb-4">
					This project doesn't have editable CV data.
				</p>
				<Link
					to="/dashboard"
					className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium underline"
				>
					Go to Dashboard
				</Link>
			</div>
		);
	}

	return (
		<EditCvBuilder
			cvData={cvData}
			projectName={projectName}
			className={className}
		/>
	);
}
