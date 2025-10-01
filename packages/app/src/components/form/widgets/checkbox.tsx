import { motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";

const tickVariants = {
	checked: {
		pathLength: 1,
		opacity: 1,
		transition: {
			duration: 0.1,
			delay: 0.1,
		},
	},
	unchecked: {
		pathLength: 0,
		opacity: 0,
		transition: {
			duration: 0.2,
		},
	},
};

export type CheckboxProps = React.ComponentProps<"input"> & {
	className?: string;
	onChange?: (e: boolean) => void;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onChange, ...props }, ref) => {
		return (
			<div className="relative flex items-center">
				<motion.div
					className={cn(
						"relative flex items-center justify-center w-5 h-5 cursor-pointer rounded border-1 transition-all bg-white border-transparent duration-200",
						checked ? "bg-black/70" : "border-gray-400",
						className,
					)}
					style={{
						boxShadow: checked
							? "inset 0 2px 8px 0 hsla(0,0%,100%,.16),inset 0 .75px .25px 0 hsla(0,0%,100%,.12),inset 0 .25px .25px 0 hsla(0,0%,100%,.32),0 3px 6px 0 rgba(0,0,0,.19)"
							: "",
					}}
					transition={{
						duration: 0.1,
					}}
					animate={
						checked
							? { scale: [null, 0.6, 1, 1, 1.05] }
							: { scale: [null, 1.05, 0.99] }
					}
					onClick={() => {
						onChange?.(!checked);
					}}
				>
					<motion.svg
						className="w-3 h-3 text-white"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="3.5"
						stroke="currentColor"
						initial={false}
						animate={checked ? "checked" : "unchecked"}
					>
						<motion.path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.5 12.75l6 6 9-13.5"
							variants={tickVariants}
						/>
					</motion.svg>
				</motion.div>
				<input
					type="checkbox"
					ref={ref}
					className="sr-only"
					checked={checked || false}
					onChange={(e) => onChange?.(e.currentTarget.checked)}
					{...props}
				/>
			</div>
		);
	},
);

Checkbox.displayName = "Checkbox";
