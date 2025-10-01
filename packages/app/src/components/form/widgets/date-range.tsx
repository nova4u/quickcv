import { AnimatePresence, motion } from "motion/react";
import React from "react";
import type { FieldError } from "react-hook-form";
import FormLabel from "@/components/form/form-label";
import FormMessage from "@/components/form/form-message";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { MonthPicker } from "./month-picker";

const MotionFormMessage = motion.create(FormMessage);

type DateRangeValue = {
	current: boolean;
	startDate?: string;
	endDate?: string;
};

export interface DateRangeProps {
	label?: string;
	placeholder?: string;
	required?: boolean;
	id?: string;
	value?: DateRangeValue;
	checkboxLabel?: string;
	onChange: (value: DateRangeValue) => void;
	isDirty?: boolean;
	error?: {
		startDate?: FieldError;
		endDate?: FieldError;
	};
}

const DateRange = React.forwardRef<HTMLInputElement, DateRangeProps>(
	(
		{
			required,
			id,
			checkboxLabel,
			error,
			value = { current: false, startDate: "", endDate: "" },
			onChange,
		},
		ref,
	) => {
		return (
			<div>
				<div className="flex items-center gap-2">
					<Checkbox
						id={id}
						checked={value.current}
						ref={ref}
						onChange={(checked) => {
							const checkedValue =
								typeof checked === "boolean" ? checked : checked.target.checked;
							if (checkedValue) {
								onChange({
									current: true,
									startDate: value.startDate,
									endDate: value.endDate,
								});
							} else {
								onChange({
									current: false,
									startDate: value.startDate,
									endDate: value.endDate,
								});
							}
						}}
					/>
					<label
						htmlFor={id}
						className="text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57 cursor-pointer select-none"
					>
						{checkboxLabel}
					</label>
				</div>

				<div className="flex gap-3 mt-4 ">
					<div className="space-y-1 flex-1">
						<FormLabel
							htmlFor={"newstartDate"}
							className="block"
							required={required}
						>
							Start Date
						</FormLabel>
						<MonthPicker
							value={value?.startDate}
							onChange={(newValue) =>
								onChange({ ...value, startDate: newValue })
							}
							placeholder="Click to select"
							className={cn("border-black/10 hover:border-black/20", {
								"border-red-500": !!error?.startDate,
							})}
						/>
						<MotionFormMessage
							layout="position"
							name="newstartDate"
							error={error?.startDate}
						/>
					</div>

					<AnimatePresence mode="popLayout" initial={false}>
						{!value.current && (
							<motion.div
								className="space-y-1 flex-1 origin-left"
								initial={{
									opacity: 0,
									filter: "blur(4px)",
									scale: 0.9,
									x: 20,
								}}
								style={{
									transformOrigin: "left",
								}}
								animate={{
									opacity: 1,
									x: 0,
									filter: "blur(0px)",
									scale: 1,
									transition: {
										delay: 0.05,
										type: "spring",
										duration: 0.18,
										bounce: 0,
									},
								}}
								exit={{
									opacity: 0,
									x: 15,
									filter: "blur(4px)",
									scale: 0.95,
									transition: { duration: 0.2, type: "spring", bounce: 0 },
								}}
							>
								<FormLabel
									htmlFor={"newstartDate"}
									className="block"
									required={required}
								>
									End Date
								</FormLabel>
								<MonthPicker
									value={value?.endDate}
									onChange={(newValue) =>
										onChange({ ...value, endDate: newValue })
									}
									placeholder="Click to select"
									className={cn("border-black/10 hover:border-black/20", {
										"border-red-500": !!error?.endDate,
									})}
								/>
								<FormMessage name="newendDate" error={error?.endDate} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	},
);

DateRange.displayName = "DateRange";

export default DateRange;
