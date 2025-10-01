import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCallbackRef } from "@/hooks/use-callback-ref";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth();

const isValidYear = (year: number): boolean =>
	year >= 1960 && year <= getCurrentYear();

const isValidMonth = (month: number): boolean => month >= 0 && month < 12;

const parseInitialValue = (value?: string) => {
	if (!value) {
		return {
			month: getCurrentMonth(),
			year: getCurrentYear(),
		};
	}

	const [yearStr, monthStr] = value.split("-");
	const parsedYear = Number.parseInt(yearStr);
	const parsedMonth = Number.parseInt(monthStr) - 1; // Convert to 0-based

	return {
		month: isValidMonth(parsedMonth) ? parsedMonth : getCurrentMonth(),
		year: isValidYear(parsedYear) ? parsedYear : getCurrentYear(),
	};
};

const formatValue = (year: number, month: number): string => {
	const monthStr = (month + 1).toString().padStart(2, "0");
	return `${year}-${monthStr}`;
};

const debounce = (callback: () => void, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(callback, delay);
	};
};

const calculateCenterItem = (
	container: HTMLDivElement,
	itemsArray: readonly unknown[],
) => {
	const itemHeight = 32; // h-8 = 32px
	const containerHeight = container.clientHeight;
	const scrollTop = container.scrollTop;
	const spacerHeight = 3 * itemHeight; // 3 spacers at top

	// Calculate which item is in the center
	const centerPosition = scrollTop + containerHeight / 2;
	const adjustedPosition = centerPosition - spacerHeight;
	const centerIndex = Math.floor(adjustedPosition / itemHeight);

	// Ensure index is within bounds
	const clampedIndex = Math.max(
		0,
		Math.min(itemsArray.length - 1, centerIndex),
	);

	return {
		index: clampedIndex,
		scrollTop,
	};
};

const scrollToCenter = (
	container: HTMLDivElement,
	index: number,
	smooth = true,
) => {
	const itemHeight = 32; // h-8 = 32px
	const containerHeight = container.clientHeight;
	const scrollTop =
		(index + 3) * itemHeight - containerHeight / 2 + itemHeight / 2;

	// Ensure we don't scroll beyond the boundaries that would show spacers
	const maxScroll = container.scrollHeight - containerHeight;
	const minScroll = 0;
	const boundedScrollTop = Math.max(minScroll, Math.min(maxScroll, scrollTop));

	// console.log(
	// 	`scrollToCenter: index=${index}, itemHeight=${itemHeight}, containerHeight=${containerHeight}, scrollTop=${scrollTop}, boundedScrollTop=${boundedScrollTop}, smooth=${smooth}`,
	// );

	container.scrollTo({
		top: boundedScrollTop,
		behavior: smooth ? "smooth" : "instant",
	});
};

const years = Array.from(
	{ length: getCurrentYear() - 1960 + 1 },
	(_, i) => 1960 + i,
);

// Clear icon component
const ClearIcon = () => (
	<svg
		className="size-3"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
	>
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M19 5L5 19M5 5l14 14"
			color="currentColor"
		/>
	</svg>
);

const MonthPicker = React.forwardRef<HTMLDivElement, MonthPickerProps>(
	({ value, onChange, placeholder = "Click to select", className }, ref) => {
		const [isOpen, setIsOpen] = useState(false);

		const [selectedMonth, setSelectedMonth] = useState(
			() => parseInitialValue(value).month,
		);
		const [selectedYear, setSelectedYear] = useState(
			() => parseInitialValue(value).year,
		);
		const onChangeRef = useCallbackRef(onChange);

		useEffect(() => {
			if (!hasInitialized.current) return;
			const newValue = formatValue(selectedYear, selectedMonth);
			onChangeRef(newValue);
		}, [selectedMonth, selectedYear, onChangeRef]);

		const monthScrollRef = useRef<HTMLDivElement>(null);
		const yearScrollRef = useRef<HTMLDivElement>(null);

		// Track if we've already initialized to prevent multiple callback scrolls
		const hasInitialized = useRef(false);

		// Reset initialization flag when popover closes
		if (!isOpen && hasInitialized.current) {
			hasInitialized.current = false;
		}

		// biome-ignore lint/correctness/useExhaustiveDependencies: IGNORE
		const monthScrollRefCallback = useCallback(
			(node: HTMLDivElement | null) => {
				monthScrollRef.current = node;

				if (node && isOpen && !hasInitialized.current) {
					scrollToCenter(node, selectedMonth, false);
					return;
				}

				if (node) {
					const handleScroll = debounce(() => {
						const { index: centerIndex } = calculateCenterItem(node, months);
						// const centerMonth = months[centerIndex];

						setSelectedMonth(centerIndex);

						// console.log(
						// 	`Center month: ${centerMonth}, Index: ${centerIndex}, ScrollTop: ${scrollTop}`,
						// );
					}, 150);

					node.addEventListener("scroll", handleScroll);

					// Cleanup function
					return () => {
						node.removeEventListener("scroll", handleScroll);
					};
				}
			},
			[isOpen],
		);

		// biome-ignore lint/correctness/useExhaustiveDependencies: IGNORE
		const yearScrollRefCallback = useCallback(
			(node: HTMLDivElement | null) => {
				yearScrollRef.current = node;

				if (node && isOpen && !hasInitialized.current) {
					const yearIndex = years.indexOf(selectedYear);
					hasInitialized.current = true;
					if (yearIndex >= 0) {
						scrollToCenter(node, yearIndex, false);
					}
					return;
				}

				// Add scroll event listener to detect center year
				if (node) {
					const handleScroll = debounce(() => {
						const { index: centerIndex } = calculateCenterItem(node, years);
						const centerYear = years[centerIndex];
						setSelectedYear(centerYear);

						// console.log(
						// 	`Center year: ${centerYear}, Index: ${centerIndex}, ScrollTop: ${scrollTop}`,
						// );
					}, 150);

					node.addEventListener("scroll", handleScroll);

					// Cleanup function
					return () => {
						node.removeEventListener("scroll", handleScroll);
					};
				}
			},
			[isOpen],
		);

		const getDisplayValue = () => {
			if (!value) return placeholder;
			const [year, month] = value.split("-");
			const monthIndex = Number.parseInt(month) - 1;
			if (monthIndex >= 0 && monthIndex < 12) {
				return `${months[monthIndex].slice(0, 3)} ${year}`;
			}
			return value;
		};

		const handleMonthClick = (monthIndex: number) => {
			setSelectedMonth(monthIndex);

			if (monthScrollRef.current) {
				scrollToCenter(monthScrollRef.current, monthIndex, true);
			}
		};

		const handleYearClick = (year: number) => {
			setSelectedYear(year);
			if (yearScrollRef.current) {
				const yearIndex = years.indexOf(year);
				// console.log(`Year: ${year}, YearIndex: ${yearIndex}`);
				// console.log("YearScrollRef dimensions:", {
				// 	scrollHeight: yearScrollRef.current.scrollHeight,
				// 	clientHeight: yearScrollRef.current.clientHeight,
				// 	scrollTop: yearScrollRef.current.scrollTop,
				// });
				scrollToCenter(yearScrollRef.current, yearIndex, true);
			}
		};

		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation(); // Prevent popover from opening
			onChange(""); // Clear the value
		};

		return (
			<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
				<Popover.Trigger asChild>
					<motion.div
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.stopPropagation();
							}
						}}
						ref={ref}
						layout="size"
						transition={{
							duration: 0.22,
							type: "spring",
							bounce: 0.22,
						}}
						style={{
							borderRadius: "14px",
							// boxShadow:
							// 	"0px 0px 0px 1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.10), 0px 4px 8px -4px rgba(0,0,0,0.07)",
						}}
						className={cn(
							"hocus:shadow-input-hover data-[state=open]:shadow-input-hover shadow-input relative w-full h-10 px-2.5 bg-white  text-left text-[13px] tracking-tight transition-shadow outline-none",
							{
								"text-black/57": !value,
								"text-black": value,
							},
							className,
						)}
					>
						<motion.span
							layout="position"
							transition={{ duration: 0 }}
							className={cn(
								"absolute top-1/2 left-3 -translate-y-1/2 select-none",
								value && "pr-8", // Add right padding when there's a value to make room for clear icon
							)}
						>
							{getDisplayValue()}
						</motion.span>

						{/* Clear icon - only show when there's a value */}
						{value && (
							<motion.button
								type="button"
								onClick={handleClear}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.15 }}
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 transition-colors text-black/60 hover:text-black/50"
							>
								<ClearIcon />
							</motion.button>
						)}
					</motion.div>
				</Popover.Trigger>

				<AnimatePresence>
					{isOpen && (
						<Popover.Portal forceMount>
							<Popover.Content
								onKeyDown={(e) => {
									e.stopPropagation();
								}}
								className="z-50  w-60 rounded-2xl bg-white shadow-xl"
								align="start"
								side="bottom"
								sideOffset={5}
								asChild
							>
								<motion.div
									initial={{
										opacity: 0,
										scale: 0.9,
										filter: "blur(5px)",
										y: -10,
									}}
									animate={{
										opacity: 1,
										scale: 1,
										y: 0,
										filter: "blur(0px)",
									}}
									exit={{
										opacity: 0,
										scale: 0.9,
										y: -10,
										filter: "blur(5px)",
										transition: {
											type: "spring",
											duration: 0.15,
											// bounce: 0.2,
										},
									}}
									transition={{
										type: "spring",
										duration: 0.18,
										bounce: 0.1,
									}}
									style={{
										transformOrigin:
											"var(--radix-popover-content-transform-origin)",
									}}
								>
									{/* Picker Container */}
									<div className="relative h-40 flex justify-center">
										{/* Fixed Center Highlight */}
										<div className="absolute inset-x-0 top-0 flex w-full h-full justify-center z-10 pointer-events-none">
											<div className="h-8 bg-black/5 absolute w-[calc(100%_-_16px)] rounded-lg z-0 top-1/2 -translate-y-1/2" />
										</div>

										{/* Month List */}
										<div
											ref={monthScrollRefCallback}
											className="flex flex-col px-4 overflow-y-scroll hidden-scrollbar snap-y snap-mandatory scroll-smooth flex-1"
											style={{
												maskImage:
													"linear-gradient(transparent 0, black 20%, black 80%, transparent 100%)",
											}}
										>
											{/* Top spacers */}
											{Array.from({ length: 3 }).map((_, i) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: IGNORE
													key={`month-spacer-top-${i}`}
													className="w-full flex items-center h-8 min-h-[32px]"
												>
													&nbsp;
												</div>
											))}

											{/* Month items */}
											{months.map((month, index) => (
												<button
													key={month}
													type="button"
													onClick={() => handleMonthClick(index)}
													className="w-full flex items-center h-8 min-h-[32px] font-medium snap-center   transition-opacity hover:opacity-70 focus:outline-none"
												>
													{month}
												</button>
											))}

											{/* Bottom spacers */}
											{Array.from({ length: 3 }).map((_, i) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: IGNORE
													key={`month-spacer-bottom-${i}`}
													className="w-full flex items-center h-8 min-h-[32px]"
												>
													&nbsp;
												</div>
											))}
										</div>

										{/* Year List */}
										<div
											ref={yearScrollRefCallback}
											className="flex flex-col px-4 overflow-y-scroll hidden-scrollbar snap-y snap-mandatory scroll-smooth flex-1"
											style={{
												maskImage:
													"linear-gradient(transparent 0, black 20%, black 80%, transparent 100%)",
											}}
										>
											{/* Top spacers */}
											{Array.from({ length: 3 }).map((_, i) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: IGNORE
													key={`year-spacer-top-${i}`}
													className="w-full flex items-center justify-end h-8 min-h-[32px]"
												>
													&nbsp;
												</div>
											))}

											{/* Year items */}
											{years.map((year) => (
												<button
													key={year}
													type="button"
													onClick={() => handleYearClick(year)}
													className="w-full flex items-center justify-end h-8 min-h-[32px] font-medium snap-center transition-opacity hover:opacity-70 focus:outline-none"
												>
													{year}
												</button>
											))}

											{/* Bottom spacers */}
											{Array.from({ length: 3 }).map((_, i) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: IGNORE
													key={`year-spacer-bottom-${i}`}
													className="w-full flex items-center justify-end  h-8 min-h-[32px]"
												>
													&nbsp;
												</div>
											))}
										</div>
									</div>
								</motion.div>
							</Popover.Content>
						</Popover.Portal>
					)}
				</AnimatePresence>
			</Popover.Root>
		);
	},
);

MonthPicker.displayName = "MonthPicker";

export { MonthPicker };
