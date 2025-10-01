import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all tracking-[-0.025em] disabled:pointer-events-none disabled:opacity-80 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: [
					"shadow-[0px_0px_0px_1px_theme(colors.slate.800),inset_0px_0px_0px_1px_#ffffff40] bg-neutral-900 text-white",
					"after:inset-0 after:absolute after:bg-gradient-to-b after:rounded-[inherit] after:from-white/30 to-transparent relative hover:after:to-white/10 after:transition-colors after:duration-200",
				],
				brand: [
					"shadow-[0px_0px_0px_0.85px_theme(colors.blue.700),inset_0px_0px_0px_1px_#ffffff50] bg-blue-600 text-white",
					"after:inset-0 after:absolute after:bg-gradient-to-b after:rounded-[inherit] to-transparent relative hover:after:to-white/10 after:from-white/20 after:transition-colors after:duration-200",
				],
				test: [
					"bg-black/80 text-white hover:bg-black/90",
					"shadow-[inset_0_-12px_16px_0_hsla(0,0%,100%,.10),inset_0_4px_16px_0_hsla(0,0%,100%,.16),inset_0_.75px_.25px_0_hsla(0,0%,100%,.12),inset_0_.25px_.25px_0_hsla(0,0%,100%,.32),0_3px_6px_0_rgba(0,0,0,.19),0_0_0_.75px_rgba(0,0,0,.56),var(--shadow)] [--shadow-color:rgb(0,0,0)]",
					"focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/80 focus-visible:ring-offset-white ",
				],
				destructive: [
					"shadow-[0px_0px_0px_0.85px_theme(colors.rose.700),inset_0px_0px_0px_1px_#ffffff50] bg-rose-600 text-white",
					"after:inset-0 after:absolute after:bg-gradient-to-b after:rounded-[inherit] after:from-50% after:to-50%  after:to-transparent relative hover:after:to-white/10 after:from-white/20 after:transition-colors after:duration-200",
				],
				secondary: [
					"flex items-center justify-center  bg-black/5  hover:bg-black/10 ",
					" text-black",
				],
			},
			shadow: {
				default: [
					"[--shadow:0_2px_4px_0_color-mix(in_hsl,_var(--shadow-color),_transparent_92%)]",
				],

				lg: [

					"[--shadow:0_2px_4px_0_color-mix(in_hsl,_var(--shadow-color),_transparent_95%)]",
				],
				xl: [
					"[--shadow:0_40px_24px_0_color-mix(in_hsl,_var(--shadow-color),_transparent_94%),0_23px_14px_0_color-mix(in_hsl,_var(--shadow-color),_transparent_92%),0_10px_10px_0_color-mix(in_hsl,_var(--shadow-color),_transparent_92%)]",
				],
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				xs: "h-7.5 px-3 py-1 has-[>svg]:px-2.5 text-[13px]",
				sm: "h-8  gap-1.5 px-3 has-[>svg]:px-2.5 text-[13px]",
				lg: "h-10  px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			shadow: 'default'
		},
	},
);

const Button = forwardRef<
	HTMLButtonElement,
	ComponentProps<"button"> &
		VariantProps<typeof buttonVariants> & {
			asChild?: boolean;
		}
>(({ className, variant, size, shadow, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			ref={ref}
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className, shadow }))}
			{...props}
		/>
	);
});

Button.displayName = "Button";

export { Button, buttonVariants };
