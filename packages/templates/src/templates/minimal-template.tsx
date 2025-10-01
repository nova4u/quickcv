import type {
	EducationItem,
	ExperienceItem,
	FormData,
} from "@quickcv/shared-schema";
import {
	calculateTotalYears,
	createPDFFilename,
	formatDateRange,
	renderRichTextContent,
} from "@quickcv/shared-utils";

interface MinimalTemplateProps {
	data: FormData;
}

interface EntryItemProps {
	item: ExperienceItem | EducationItem;
	showFullTime?: boolean;
}

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
	return (
		<div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
			<h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 tracking-widest uppercase">
				{title}
			</h3>
			{subtitle && (
				<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
					{subtitle}
				</span>
			)}
		</div>
	);
}

function ExperienceOrEducationItem({
	item,
	showFullTime = false,
}: EntryItemProps) {
	const isExperience = "position" in item;
	const title = isExperience ? item.position : item.degree;
	const subtitle = isExperience ? item.company : item.institution;
	const website = isExperience ? item.website : undefined;

	return (
		<div data-motion="fade-in-up" className="group">
			{/* Header with title and date */}
			<div className="flex sm:flex-row flex-col-reverse justify-between items-start gap-1">
				<div className="flex-1">
					{website ? (
						<h4 className="text-lg font-semibold text-black dark:text-white leading-6">
							<a
								href={website}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors items-center gap-1 inline-block"
							>
								{title} at {subtitle}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="size-4 mt-0.5 translate-0.5  align-baseline inline"
									viewBox="0 0 24 24"
									fill="none"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									stroke="currentColor"
								>
									<path d="m6.5 17.5 11-11m0 0h-9m9 0v9" />
								</svg>
							</a>
						</h4>
					) : (
						<h4 className="text-lg font-semibold text-black dark:text-white leading-6">
							{title} at {subtitle}
						</h4>
					)}
				</div>
				<div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap sm:ml-4">
					{formatDateRange(item.dates)}
				</div>
			</div>

			{/* Location info */}
			{item.location && (
				<div className="flex items-center gap-2 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
					<span>{item.location}</span>
					{showFullTime && (
						<>
							<span className="text-neutral-400 dark:text-neutral-600">|</span>
							<span>Full-time</span>
						</>
					)}
				</div>
			)}

			{/* Description */}
			{item.description && (
				<div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1 max-w-2xl">
					{renderRichTextContent(item.description)}
				</div>
			)}
		</div>
	);
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
	const { generalInfo, experience, education, socials } = data;

	return (
		<div
			data-theme="minimal"
			data-motion="stagger-container"
			className="max-w-4xl mx-auto leading-relaxed space-y-14 p-4 px-4 transition-colors"
		>
			{/* Header Section */}
			<header>
				<div
					data-motion="fade-in-up"
					data-stagger="1"
					className="sm:flex gap-4 items-center"
				>
					{generalInfo.photo && (
						<div className="flex sm:justify-center">
							<div className="relative size-22 overflow-hidden rounded-full">
								<img
									alt={generalInfo.fullName}
									className="w-full h-full object-cover"
									src={generalInfo.photo}
								/>
							</div>
						</div>
					)}
					<div className="flex-1 mt-4 sm:mt-0">
						<h1 className="text-2xl leading-tight sm:text-3xl font-semibold tracking-tight text-black dark:text-white">
							{generalInfo.fullName}
						</h1>
						<h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
							{generalInfo.professionalTitle}
						</h2>
						{generalInfo.website && (
							<a
								className="text-neutral-600 dark:text-neutral-400 text-sm font-medium inline-flex gap-1.5 items-center hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
								href={generalInfo.website}
								target="_blank"
								rel="noreferrer"
							>
								{generalInfo.website}
							</a>
						)}
					</div>
				</div>

				{generalInfo.about && (
					<div
						data-motion="fade-in-up"
						data-stagger="2"
						className="mt-4 sm:mt-8 text-zinc-700 dark:text-zinc-300 leading-normal sm:leading-relaxed max-w-none"
					>
						{renderRichTextContent(generalInfo.about)}
					</div>
				)}
			</header>

			{/* Experience Section */}
			{experience.experiences.length > 0 && (
				<section data-motion="fade-in-up" data-stagger="3" className="">
					<SectionHeader
						title="Experience"
						subtitle={calculateTotalYears(
							experience.experiences.map((exp) => exp.dates),
						)}
					/>
					<div className="space-y-8 mt-3">
						{experience.experiences.map((exp, index) => (
							<ExperienceOrEducationItem
								key={`exp-${exp.company}-${index}`}
								item={exp}
								showFullTime={true}
							/>
						))}
					</div>
				</section>
			)}

			{/* Education Section */}
			{education.education.length > 0 && (
				<section data-motion="fade-in-up" data-stagger="4" className="">
					<SectionHeader title="Education" />
					<div className="space-y-8 mt-3">
						{education.education.map((edu, index) => (
							<ExperienceOrEducationItem
								key={`edu-${edu.institution}-${index}`}
								item={edu}
								showFullTime={false}
							/>
						))}
					</div>
				</section>
			)}

			{/* Socials Section */}
			{socials.socials.length > 0 && (
				<section data-motion="fade-in-up" data-stagger="5" className="">
					<SectionHeader title="Socials" />
					<div className="space-y-4 mt-3">
						{socials.socials.map((social) => (
							<div
								key={social.id}
								className="flex  sm:gap-4 sm:flex-row flex-col"
							>
								<div className="w-32 flex-shrink-0">
									<span className="text-sm text-neutral-500 dark:text-neutral-400">
										{social.name}
									</span>
								</div>
								<div className="flex-1">
									<a
										href={social.url}
										className="text-sm font-medium text-black dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
										target="_blank"
										rel="noopener noreferrer"
									>
										{social.url}
									</a>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Download CV Button */}
			<a
				download={createPDFFilename(generalInfo.fullName)}
				href={`${createPDFFilename(generalInfo.fullName)}`}
				className="fixed bottom-6 right-6 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="size-4 mr-2 inline"
					viewBox="0 0 24 24"
					fill="none"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					stroke="currentColor"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7,10 12,15 17,10" />
					<line x1="12" x2="12" y1="15" y2="3" />
				</svg>
				Download CV
			</a>
		</div>
	);
}

export const name = "Minimal" as const;
