import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
	label?: string;
	invalid?: boolean;
	required?: boolean;
}

export const inputVariants = cva(
	[
		"w-full  outline-none transition-shadow duration-200 border-0  text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black placeholder:text-black/47 px-2.5 py-2.5 rounded-xl bg-input",
		"disabled:bg-gray-50 disabled:text-gray-500",
	],
	{
		variants: {
			invalid: {
				true: "shadow-input-invalid",
				false: "shadow-input hocus:shadow-input-hover",
			},
		},
	},
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, required, label, invalid, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				className={cn(inputVariants({ invalid }), className)}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input };
