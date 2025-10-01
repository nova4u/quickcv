import type { ExperienceItem } from "@quickcv/shared-schema";
import { formatDateRange } from "@quickcv/shared-utils";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { RichTextDisplay } from "@/components/form/widgets/rich-text-content";
import { Button } from "@/components/ui/button";
import {
	TooltipPopover,
	TooltipPopoverClose,
	TooltipPopoverContent,
	TooltipPopoverTooltipContent,
	TooltipPopoverTrigger,
} from "@/components/ui/tooltip-popover";

interface ExperienceListProps {
	items: ExperienceItem[];
	onDelete?: (index: number) => void;
	onEdit?: (index: number) => void;
	onAddNew?: () => void;
	showActions?: boolean;
	emptyStateTitle?: string;
	emptyStateButton?: string;
}

const DeletePopover: React.FC<{
	experience: ExperienceItem;
	index: number;
	onDelete: (index: number) => void;
}> = ({ experience, index, onDelete }) => {
	return (
		<TooltipPopover delayDuration={300}>
			<TooltipPopoverTrigger>
				<button
					type="button"
					className="size-4.5 flex items-center justify-center text-black/40 hover:text-red-500 transition-colors relative"
					title="Delete experience"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
							d="m19.5 5.5l-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584c-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5M9 11.735h6m-4.5 3.919h3M3 5.5h18m-4.945 0l-.682-1.408c-.454-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.034 2c-1.065 0-1.598 0-2.039.234a2 2 0 0 0-.278.18c-.396.303-.617.788-1.059 1.757L8.053 5.5"
							color="currentColor"
						/>
					</svg>
				</button>
			</TooltipPopoverTrigger>
			<TooltipPopoverTooltipContent side="top" sideOffset={10}>
				<p className="font-medium">Delete experience</p>
			</TooltipPopoverTooltipContent>
			<TooltipPopoverContent>
				<div className="space-y-3">
					<div>
						<h4 className="text-sm tracking-tight font-medium  text-black">
							Delete this experience?
						</h4>
						<p className="text-xs text-black/60 mt-1">
							This will permanently remove "{experience.position} at{" "}
							{experience.company}" from your CV.
						</p>
					</div>
					<div className="flex justify-end gap-2">
						<TooltipPopoverClose asChild>
							<Button
								size="xs"
								variant="destructive"
								className="h-6.5"
								onClick={() => onDelete(index)}
							>
								Yes, Delete
							</Button>
						</TooltipPopoverClose>
						<TooltipPopoverClose asChild>
							<Button className="h-6.5 flex-grow" size="xs" variant="secondary">
								Cancel
							</Button>
						</TooltipPopoverClose>
					</div>
				</div>
			</TooltipPopoverContent>
		</TooltipPopover>
	);
};

export const ExperienceList: React.FC<ExperienceListProps> = ({
	items: experiences,
	onEdit,
	onDelete,
	onAddNew,
	showActions = true,
	emptyStateTitle = "No work experience added yet.",
	emptyStateButton = "Add your first experience",
}) => {
	if (experiences.length === 0) {
		return (
			<div className="text-center py-12 text-black/50">
				<p className="text-sm">{emptyStateTitle}</p>
				{onAddNew && (
					<button
						type="button"
						onClick={onAddNew}
						className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors"
					>
						{emptyStateButton}
					</button>
				)}
			</div>
		);
	}

	return (
		<motion.div layout="size" className="space-y-4">
			<AnimatePresence initial={false} mode="popLayout">
				{experiences.map((experience, index) => (
					<motion.div
						layout="position"
						key={`${experience.company}-${experience.position}-${index}`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2, type: "spring", bounce: 0 }}
						className={`border-b border-black/10 pb-2 ${
							index === experiences.length - 1 ? "border-b-0 pb-0" : ""
						}`}
					>
						<div className="flex-col md:flex-row flex justify-between gap-2 md:gap-6">
							{/* Date Column */}
							<div className="flex-shrink-0 w-[120px]">
								<p className="text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57">
									{formatDateRange(experience.dates)}
								</p>
							</div>

							{/* Content Column */}
							<div className="flex-1">
								<div className="flex items-center justify-between mb-1">
									{showActions && onEdit ? (
										<button
											type="button"
											className="text-left text-[15px] font-medium leading-[1.33em] tracking-[-0.02em] text-black cursor-pointer hover:text-black/70 focus:text-black/70 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-1 rounded-sm transition-colors"
											onClick={() => onEdit(index)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													onEdit(index);
												}
											}}
											aria-label={`Edit experience: ${experience.position} at ${experience.company}`}
										>
											{experience.position} at {experience.company}
											{experience.website && (
												<svg
													className="inline-block ml-1 w-3.5 mb-1"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
												>
													<path
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M6 18L18 6m0 0H9m9 0v9"
													/>
												</svg>
											)}
										</button>
									) : (
										<h3 className="text-[15px] font-medium leading-[1.33em] tracking-[-0.02em] text-black">
											{experience.position} at {experience.company}
											{experience.website && (
												<svg
													className="inline-block ml-1 w-3 h-3"
													viewBox="0 0 7 7"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
												>
													<path d="M1 6L6 1M6 1H2M6 1V5" />
												</svg>
											)}
										</h3>
									)}

									{showActions && onDelete && (
										<DeletePopover
											experience={experience}
											index={index}
											onDelete={onDelete}
										/>
									)}
								</div>

								<p className="text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57 mb-2">
									{experience.location}
								</p>

								{experience.description && (
									<div
										className={`${showActions ? "max-h-[90px] overflow-hidden relative" : ""}`}
										style={{
											...(showActions && {
												maskImage:
													"linear-gradient(to bottom, black 60%, transparent 100%)",
											}),
										}}
									>
										<RichTextDisplay
											content={experience.description}
											className="text-[12px] font-normal leading-[1.67em] tracking-[-0.02em] text-black/57"
										/>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
};
