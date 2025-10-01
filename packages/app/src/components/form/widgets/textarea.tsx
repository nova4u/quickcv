import type * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	invalid?: boolean;
	required?: boolean;
}

function Textarea({
	className,
	label,
	invalid,
	required,
	...props
}: TextareaProps) {
	return (
		<div className="flex flex-col gap-1.5 w-full">
			<div className="relative">
				<textarea
					id={props.id}
					className={cn(
						"w-full bg-transparent outline-none transition-shadow duration-200 border-0 text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black placeholder:text-black/47 resize-none min-h-[60px]",
						"px-2.5 py-2.5 rounded-xl bg-transparent shadow-input",
						"hocus:shadow-input-hover",
						invalid && "shadow-input-invalid",
						className,
					)}
					{...props}
				/>
			</div>
		</div>
	);
}

export { Textarea };
