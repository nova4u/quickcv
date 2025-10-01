import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

interface UrlInputProps
	extends Omit<React.ComponentProps<"input">, "onChange"> {
	label?: string;
	invalid?: boolean;
	required?: boolean;
	onChange?: (value: string) => void;
}

const urlInputVariants = cva(
	[
		"w-full flex gap-1.5 relative outline-none overflow-hidden transition-shadow duration-200 border-0  text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black placeholder:text-black/47  rounded-xl bg-input",
	],
	{
		variants: {
			invalid: {
				true: "shadow-input-invalid",
				false: "shadow-input [&:has(input:focus)]:shadow-input-hover",
			},
		},
	},
);

const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
	({ className, type, required, label, invalid, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			props.onChange?.(`https://${e.target.value}`);
		};

		const value = props.value?.toString().replace("https://", "");

		return (
			<div className={cn(urlInputVariants({ invalid }), className)}>
				<div className=" bg-gray-100 px-2 py-2.5 text-gray-500 border-r-1 border-gray-200 ">
					https://
				</div>

				<input
					ref={ref}
					type={"text"}
					className="w-full focus:outline-none"
					{...props}
					value={value}
					onChange={handleChange}
				/>
			</div>
		);
	},
);

UrlInput.displayName = "UrlInput";

export { UrlInput };
