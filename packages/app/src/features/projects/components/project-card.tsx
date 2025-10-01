import { config } from "@/config/app";

interface ProjectCardProps {
	project: {
		id: string;
		name: string;
		url: string;
		updatedAt: number;
		createdAt: number;
	};
}

export function ProjectCard({ project }: ProjectCardProps) {
	return (
		<div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 bg-green-500 rounded-full" />
					<h4 className="text-sm font-medium text-gray-900 truncate">
						{project.name.replace(config.projectPrefix, "")}
					</h4>
				</div>
				<p className="text-xs text-gray-500 mt-1">
					Updated {new Date(project.updatedAt).toLocaleDateString()}
				</p>
			</div>
			<div className="flex items-center gap-2 ml-3">
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
				>
					<svg
						className="w-3 h-3"
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
					View →
				</a>
			</div>
		</div>
	);
}
