import { type FormData, richTextToPlainText } from "@quickcv/shared-schema";
import { formatDateRange } from "@quickcv/shared-utils";

interface ProfessionalTemplateProps {
	data: FormData;
}

export default function ProfessionalTemplate({
	data,
}: ProfessionalTemplateProps) {
	const { generalInfo, experience, education, socials } = data;

	return (
		<div
			data-motion="stagger-container"
			className="max-w-4xl mx-auto bg-white dark:bg-gray-950 leading-relaxed transition-colors"
			style={{ minHeight: "297mm", padding: "60px 50px", opacity: 0 }}
		>
			<header
				data-motion="fade-in-up"
				className="mb-16"
				style={{ opacity: 0, transform: "translateY(20px)" }}
			>
				<div className="flex gap-4">
					<script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: i just have to
						dangerouslySetInnerHTML={{
							__html: `console.log("123")`,
						}}
					/>
					{generalInfo.photo && (
						<div className="flex justify-center">
							<div className="relative size-22 overflow-hidden rounded-full">
								<img
									alt={generalInfo.fullName}
									className="object-cover"
									src={generalInfo.photo}
								/>
							</div>
						</div>
					)}
					<div className="">
						<h1 className="text-xl font-medium tracking-tight text-black dark:text-white">
							{generalInfo.fullName}
						</h1>
						<h2 className="text-lg font-medium text-slate-600 dark:text-slate-400 trackeg-wide">
							{generalInfo.professionalTitle}
						</h2>
						{generalInfo.website && (
							<a
								className="text-gray-700 dark:text-gray-300 rounded-full py-1 px-3 text-sm font-medium tracking-tighter inline-flex gap-1.5 items-center -ml-3"
								href={generalInfo.website}
								target="_blank"
								rel="noreferrer"
							>
								{generalInfo.website.replace(/https?:\/\//, "")}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="size-3.5"
									viewBox="0 0 24 24"
									fill="none"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									stroke="currentColor"
								>
									<path d="M21 3h-6.75M21 3v6.75M21 3l-8.25 8.25M9.4 3c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C3 6.04 3 7.16 3 9.4v5.2c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748C6.04 21 7.16 21 9.4 21h5.2c2.24 0 3.36 0 4.216-.436a4 4 0 0 0 1.748-1.748C21 17.96 21 16.84 21 14.6v-1.1" />
								</svg>
							</a>
						)}
					</div>
				</div>

				{generalInfo.about && (
					<p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mt-3">
						{richTextToPlainText(generalInfo.about)}
					</p>
				)}

				{socials.socials.length > 0 && (
					<div className="flex gap-8 pt-4">
						{socials.socials.map((social) => (
							<a
								key={social.id}
								href={social.url}
								className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm font-medium tracking-wide"
								target="_blank"
								rel="noopener noreferrer"
							>
								{social.name}
							</a>
						))}
					</div>
				)}
			</header>

			{/* Experience Section */}
			{experience.experiences.length > 0 && (
				<section
					data-motion="fade-in-up"
					className="mb-16"
					style={{ opacity: 0, transform: "translateY(20px)" }}
				>
					<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-widest uppercase mb-8 pb-3 border-b border-slate-200 dark:border-slate-700">
						Experience
					</h3>
					<div className="space-y-12">
						{experience.experiences.map((exp, index) => (
							<div
								key={`exp-${exp.company}-${index}`}
								data-motion="fade-in-up"
								className="group"
								style={{ opacity: 0, transform: "translateY(20px)" }}
							>
								<div className="grid grid-cols-4 gap-8">
									<div className="col-span-1">
										<div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
											{formatDateRange(exp.dates)}
										</div>
										{exp.location && (
											<div className="text-sm text-slate-400 dark:text-slate-500 mt-1">
												{exp.location}
											</div>
										)}
									</div>
									<div className="col-span-3">
										<div className="space-y-3">
											<div>
												<h4 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-1">
													{exp.position}
												</h4>
												<div className="flex items-center gap-3">
													<span className="text-slate-700 dark:text-slate-300 font-medium">
														{exp.company}
													</span>
													{exp.website && (
														<a
															href={exp.website}
															className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-sm"
															target="_blank"
															rel="noopener noreferrer"
														>
															{exp.website.replace(/https?:\/\//, "")}
														</a>
													)}
												</div>
											</div>
											{exp.description && (
												<p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
													{richTextToPlainText(exp.description)}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Education Section */}
			{education.education.length > 0 && (
				<section
					data-motion="fade-in-up"
					className="mb-16"
					style={{ opacity: 0, transform: "translateY(20px)" }}
				>
					<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-widest uppercase mb-8 pb-3 border-b border-slate-200 dark:border-slate-700">
						Education
					</h3>
					<div className="space-y-12">
						{education.education.map((edu, index) => (
							<div
								key={`edu-${edu.institution}-${index}`}
								data-motion="fade-in-up"
								className="group"
								style={{ opacity: 0, transform: "translateY(20px)" }}
							>
								<div className="grid grid-cols-4 gap-8">
									<div className="col-span-1">
										<div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
											{formatDateRange(edu.dates)}
										</div>
										{edu.location && (
											<div className="text-sm text-slate-400 dark:text-slate-500 mt-1">
												{edu.location}
											</div>
										)}
									</div>
									<div className="col-span-3">
										<div className="space-y-3">
											<div>
												<h4 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-1">
													{edu.degree}
												</h4>
												<div className="text-slate-700 dark:text-slate-300 font-medium">
													{edu.institution}
												</div>
											</div>
											{edu.description && (
												<p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
													{richTextToPlainText(edu.description)}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
export const name = "Professional" as const;
