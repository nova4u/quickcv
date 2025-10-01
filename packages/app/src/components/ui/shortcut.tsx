import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const shortcutVariants = cva(
	[
		"inline-flex items-center  justify-center gap-2  rounded-sm text-xs font-medium transition-all tracking-[-0.025em] shadow-[inset_0px_0px_0px_1px_var(--border-color),0px_2px_0px_var(--border-color)]",
		"h-4.5 px-1.5",
	],
	{
		variants: {
			variant: {
				default: ["[--border-color:#5A5A5A]  bg-white/15"],
				secondary: "[--border-color:#C6C6CB] bg-black/5 text-black/50",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Shortcut({
	className,
	variant,
	asChild = false,
	...props
}: ComponentProps<"div"> &
	VariantProps<typeof shortcutVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="shortcut"
			className={cn(shortcutVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Shortcut, shortcutVariants };
