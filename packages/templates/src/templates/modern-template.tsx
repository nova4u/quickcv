import { type FormData, richTextToPlainText } from "@quickcv/shared-schema";
import { formatDateRange } from "@quickcv/shared-utils";

interface ModernTemplateProps {
	data: FormData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
	const { generalInfo, experience, education, socials } = data;

	return (
		<main
			className="mx-auto max-w-3xl space-y-8 px-4 py-8 bg-white dark:bg-neutral-900 transition-colors"
			data-motion="stagger-container"
		>
			{/* Header Section */}
			<div
				className="flex flex-col items-start gap-6 md:flex-row"
				data-motion="fade-in-up"
			>
				{/* Profile Photo */}
				{generalInfo.photo && (
					<div className="relative h-24 w-24 overflow-hidden rounded-full">
						<img
							alt={generalInfo.fullName}
							width="96"
							height="96"
							className="object-cover"
							src={generalInfo.photo}
						/>
					</div>
				)}

				<div className="space-y-1">
					<h1 className="text-3xl font-bold text-black dark:text-white">
						{generalInfo.fullName}
					</h1>
					<p className="text-zinc-600 dark:text-zinc-400">
						{generalInfo.professionalTitle}
					</p>

					{/* Social Links */}
					{socials.socials.length > 0 && (
						<div className="-ml-1 w-full">
							<div className="flex flex-wrap gap-2">
								{socials.socials.map((social) => (
									<a
										key={social.id}
										href={social.url}
										className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm font-medium text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
										target="_blank"
										rel="noopener noreferrer"
									>
										{social.name}
										<svg
											width="15"
											height="15"
											viewBox="0 0 15 15"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3"
										>
											<path
												d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
												fill="currentColor"
												fillRule="evenodd"
												clipRule="evenodd"
											/>
										</svg>
									</a>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* About Section */}
			{generalInfo.about && (
				<section className="space-y-4" data-motion="fade-in-up">
					<h2 className="text-xl font-semibold text-black dark:text-white">
						About
					</h2>
					<div className="space-y-4 text-zinc-800 dark:text-zinc-300">
						<p>{richTextToPlainText(generalInfo.about)}</p>
					</div>
				</section>
			)}

			{/* Experience Section */}
			{experience.experiences.length > 0 && (
				<section className="space-y-4" data-motion="fade-in-up">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-black dark:text-white">
							Work Experience
						</h2>
						<div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200">
							{experience.experiences.length}+ years
						</div>
					</div>
					<div className="space-y-6">
						{experience.experiences.map((exp, index) => (
							<div
								key={`exp-${exp.company}-${index}`}
								className="grid grid-cols-1 gap-1 md:grid-cols-[1fr_4fr]"
								data-motion="fade-in-up"
							>
								<div className="text-sm text-zinc-500 dark:text-zinc-400">
									{formatDateRange(exp.dates)}
								</div>
								<div>
									<div className="font-medium text-black dark:text-white">
										{exp.website ? (
											<a
												href={exp.website}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:text-blue-600 dark:hover:text-blue-400"
											>
												{exp.position} at {exp.company}
											</a>
										) : (
											<span>
												{exp.position} at {exp.company}
											</span>
										)}
									</div>
									{exp.location && (
										<div className="text-sm text-zinc-500 dark:text-zinc-400">
											{exp.location}
										</div>
									)}
									{exp.description && (
										<div className="mt-3 text-sm tracking-[-0.00005em] text-zinc-900 dark:text-zinc-400">
											{richTextToPlainText(exp.description)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Education Section */}
			{education.education.length > 0 && (
				<section className="space-y-4" data-motion="fade-in-up">
					<h2 className="text-xl font-semibold text-black dark:text-white">
						Education
					</h2>
					<div className="space-y-6">
						{education.education.map((edu, index) => (
							<div
								key={`edu-${edu.institution}-${index}`}
								className="grid grid-cols-1 gap-1 md:grid-cols-[1fr_4fr]"
								data-motion="fade-in-up"
							>
								<div className="text-sm text-zinc-500 dark:text-zinc-400">
									{formatDateRange(edu.dates)}
								</div>
								<div>
									<div className="font-medium text-black dark:text-white">
										{edu.degree} at {edu.institution}
									</div>
									{edu.location && (
										<div className="text-sm text-zinc-500 dark:text-zinc-400">
											{edu.location}
										</div>
									)}
									{edu.description && (
										<div className="mt-3 text-sm tracking-[-0.00005em] text-zinc-900 dark:text-zinc-400">
											{richTextToPlainText(edu.description)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</main>
	);
}

export const name = "Modern" as const;
