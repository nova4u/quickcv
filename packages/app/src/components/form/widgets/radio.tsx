import { motion } from "motion/react";
import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { formLabelVariants } from "@/components/form/form-label";

const circleVariants = {
	checked: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.1,
			delay: 0.05,
		},
	},
	unchecked: {
		scale: 0,
		opacity: 0,
		transition: {
			duration: 0.15,
		},
	},
};

export type RadioProps = React.ComponentProps<"input"> & {
	className?: string;
	label?: string;
	onChange?: (checked: boolean) => void;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
	({ className, checked, onChange, ...props }, ref) => {
		return (
			<div className="relative flex items-center gap-2">
				<input
					type="radio"
					ref={ref}
					className="sr-only"
					checked={checked || false}
					onChange={(e) => {
						onChange?.(e.target.checked);
					}}
					{...props}
				/>
				<motion.div
					className={cn(
						"relative flex items-center justify-center w-5 h-5 cursor-pointer rounded-full border-1 transition-all duration-200 border-transparent",
						checked
							? "bg-white border-black"
							: "bg-white shadow-input focus-visible:shadow-input-hover",
						className,
					)}
					transition={{
						duration: 0.1,
					}}
					animate={
						checked
							? { scale: [null, 0.9, 1, 1, 1.05] }
							: { scale: [null, 1.05, 0.99] }
					}
					onClick={() => {
						onChange?.(!checked);
					}}
				>
					<motion.div
						className="w-2.5 h-2.5 bg-black rounded-full"
						initial={false}
						animate={checked ? "checked" : "unchecked"}
						variants={circleVariants}
					/>
				</motion.div>
				<label
					htmlFor={props.id}
					className={cn(formLabelVariants(), "cursor-pointer")}
				>
					{props.label}
				</label>
			</div>
		);
	},
);

Radio.displayName = "Radio";
