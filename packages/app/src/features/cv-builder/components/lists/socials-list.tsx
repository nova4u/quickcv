import type { SocialItem } from "@quickcv/shared-schema";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

const generateId = () =>
	`social-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface SocialsListProps {
	socials: SocialItem[];
	onDataChange?: (socials: SocialItem[]) => void;
	onAddNew?: () => void;
	showActions?: boolean;
	showInlineEditing?: boolean;
}

export interface SocialsListRef {
	handleAddNew: () => void;
}

export const SocialsList = forwardRef<SocialsListRef, SocialsListProps>(
	(
		{
			socials,
			onDataChange,
			onAddNew,
			showActions = true,
			showInlineEditing = true,
		},
		ref,
	) => {
		const [localSocials, setLocalSocials] = useState<SocialItem[]>(socials);
		// const [editingField, setEditingField] = useState<string | null>(null);
		const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

		// Sync local state with props, ensuring all items have IDs
		useEffect(() => {
			const socialsWithIds = socials.map((social) =>
				social.id ? social : { ...social, id: generateId() },
			);
			setLocalSocials(socialsWithIds);

			// If we added IDs, update the parent
			if (
				socialsWithIds.some((social, index) => social.id !== socials[index]?.id)
			) {
				onDataChange?.(socialsWithIds);
			}
		}, [socials, onDataChange]);

		const handleAddNewInternal = () => {
			const newSocial: SocialItem = {
				id: generateId(),
				name: "",
				url: "",
			};

			const updatedSocials = [...localSocials, newSocial];
			setLocalSocials(updatedSocials);
			onDataChange?.(updatedSocials);

			// Focus on the new item's name field
			const newIndex = updatedSocials.length - 1;
			const inputId = `social-${newIndex}-name`;
			setTimeout(() => {
				inputRefs.current[inputId]?.focus();
				// setEditingField(inputId);
			}, 100);
		};

		// Expose the handleAddNew function via ref
		useImperativeHandle(ref, () => ({
			handleAddNew: onAddNew || handleAddNewInternal,
		}));

		const handleInputChange = (
			index: number,
			field: "name" | "url",
			value: string,
		) => {
			const updatedSocials = localSocials.map((social, i) =>
				i === index ? { ...social, [field]: value } : social,
			);
			setLocalSocials(updatedSocials);
		};

		const handleInputBlur = () => {
			// Save changes when losing focus
			onDataChange?.(localSocials);
			// setEditingField(null);
		};

		// const handleInputFocus = (index: number, field: "name" | "url") => {
		//	const inputId = `social-${index}-${field}`;
		//	// setEditingField(inputId);
		// };

		const handleDelete = (index: number) => {
			const updatedSocials = localSocials.filter((_, i) => i !== index);
			setLocalSocials(updatedSocials);
			onDataChange?.(updatedSocials);
		};

		const handleKeyDown = (
			e: React.KeyboardEvent,
			index: number,
			field: "name" | "url",
		) => {
			switch (e.key) {
				case "Tab": {
					// Save current changes on tab
					onDataChange?.(localSocials);

					if (field === "name" && !e.shiftKey) {
						// Tab from name to url of same item
						e.preventDefault();
						const urlInputId = `social-${index}-url`;
						inputRefs.current[urlInputId]?.focus();
					} else if (
						field === "url" &&
						!e.shiftKey &&
						index < localSocials.length - 1
					) {
						// Tab from url to name of next item
						e.preventDefault();
						const nextNameInputId = `social-${index + 1}-name`;
						inputRefs.current[nextNameInputId]?.focus();
					} else if (field === "url" && e.shiftKey) {
						// Shift+Tab from url to name of same item
						e.preventDefault();
						const nameInputId = `social-${index}-name`;
						inputRefs.current[nameInputId]?.focus();
					} else if (field === "name" && e.shiftKey && index > 0) {
						// Shift+Tab from name to url of previous item
						e.preventDefault();
						const prevUrlInputId = `social-${index - 1}-url`;
						inputRefs.current[prevUrlInputId]?.focus();
					}
					break;
				}
				case "Enter": {
					// Add new item on Enter
					e.preventDefault();
					handleAddNewInternal();
					break;
				}
				case "Escape":
				case "Backspace": {
					const currentSocial = localSocials[index];
					if (
						currentSocial &&
						!currentSocial.name.trim() &&
						!currentSocial.url.trim()
					) {
						handleDelete(index);
					}
					break;
				}
			}
		};

		// Generate stable keys for animations using unique IDs
		const getItemKey = (social: SocialItem) => {
			return social.id || `fallback-${Date.now()}`;
		};

		return (
			<motion.div
				layout="size"
				layoutRoot
				style={{
					height: "auto",
				}}
				className="space-y-4  h-auto"
				transition={{
					duration: 5,
					type: "spring",
					bounce: 0,
				}}
			>
				<AnimatePresence initial={false} mode="popLayout">
					{localSocials.map((social, index) => {
						const itemKey = getItemKey(social);
						const isLast = index === localSocials.length - 1;

						return (
							<motion.div
								layout="position"
								key={itemKey}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2, type: "spring", bounce: 0 }}
								className={`border-b border-black/10 pb-4 ${isLast ? "border-b-0" : ""}`}
							>
								<div className="flex-col md:flex-row flex justify-between gap-2 md:gap-6">
									{/* Name Column */}
									<div className="flex-shrink-0 w-[120px]">
										{showInlineEditing ? (
											<input
												ref={(el) => {
													inputRefs.current[`social-${index}-name`] = el;
												}}
												type="text"
												value={social.name}
												onChange={(e) =>
													handleInputChange(index, "name", e.target.value)
												}
												onBlur={() => handleInputBlur()}
												// onFocus={() => handleInputFocus(index, "name")}
												onKeyDown={(e) => handleKeyDown(e, index, "name")}
												className="w-full h-5 bg-transparent border-none text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57 placeholder:text-black/30 outline-none focus:text-black/80"
												placeholder="Platform"
											/>
										) : (
											<span className="text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57">
												{social.name || "Platform"}
											</span>
										)}
									</div>

									{/* Content Column */}
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-0.5 flex-1">
												{showInlineEditing ? (
													<input
														ref={(el) => {
															inputRefs.current[`social-${index}-url`] = el;
														}}
														type="text"
														value={social.url}
														onChange={(e) =>
															handleInputChange(index, "url", e.target.value)
														}
														onBlur={() => handleInputBlur()}
														// onFocus={() => handleInputFocus(index, "url")}
														onKeyDown={(e) => handleKeyDown(e, index, "url")}
														className="w-full h-5 bg-transparent border-none text-[15px] font-medium leading-[1.33em] tracking-[-0.02em] text-black placeholder:text-black/30 outline-none focus:text-black/70"
														placeholder="https://example.com"
													/>
												) : (
													<>
														<span className="text-[15px] font-medium leading-[1.33em] tracking-[-0.02em] text-black">
															{social.url || "https://example.com"}
														</span>
														{social.url && (
															<div className="w-4 h-4 flex items-center justify-center">
																<svg
																	width="7"
																	height="7"
																	viewBox="0 0 7 7"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="1"
																>
																	<path d="M1 6L6 1M6 1H2M6 1V5" />
																</svg>
															</div>
														)}
													</>
												)}
											</div>

											{showActions && (
												<button
													onClick={() => handleDelete(index)}
													className="w-4 h-4 flex items-center justify-center text-black/40 hover:text-red-500 transition-colors ml-2"
													title="Delete social link"
												>
													<svg
														width="12"
														height="12"
														viewBox="0 0 12 12"
														fill="none"
													>
														<path
															d="M9 3L3 9M3 3L9 9"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											)}
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>
		);
	},
);

SocialsList.displayName = "SocialsList";
