import { config } from "@/config/app";

interface ProjectGridCardProps {
	project: {
		id: string;
		name: string;
		url: string;
		updatedAt: number;
		createdAt: number;
	};
}

export function ProjectGridCard({ project }: ProjectGridCardProps) {
	const displayName = project.name.replace(config.projectPrefix, "");
	const createdDate = new Date(project.createdAt).toLocaleDateString();
	const updatedDate = new Date(project.updatedAt).toLocaleDateString();

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
			{/* Header */}
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
					<h3 className="font-medium text-gray-900 truncate">{displayName}</h3>
				</div>
				<div className="flex items-center gap-1 ml-2">
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
						title="View live site"
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
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
				</div>
			</div>

			{/* URL */}
			<div className="mb-3">
				<p className="text-sm text-gray-600 truncate" title={project.url}>
					{project.url}
				</p>
			</div>

			{/* Meta Info */}
			<div className="flex items-center justify-between text-xs text-gray-500">
				<span>Created {createdDate}</span>
				<span>Updated {updatedDate}</span>
			</div>

			{/* Actions */}
			<div className="mt-4 flex gap-2">
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
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
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
					View Live
				</a>
				<button
					onClick={() => navigator.clipboard.writeText(project.url)}
					className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
					title="Copy URL"
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
				</button>
			</div>
		</div>
	);
}
