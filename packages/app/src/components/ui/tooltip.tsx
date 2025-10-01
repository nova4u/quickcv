import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { createContext, useContext } from "react";
import { useControllableState } from "@/hooks/use-controllable-state";
import { cn } from "@/lib/utils";

const TooltipContext = createContext<{
	isOpen: boolean;
} | null>(null);

function useTooltipContext() {
	const context = useContext(TooltipContext);
	if (!context) {
		throw new Error("Tooltip components must be used within a Tooltip");
	}
	return context;
}

function TooltipProvider({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

function Tooltip({
	children,
	open,
	onOpenChange,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useControllableState({
		prop: open,
		defaultProp: false,
		onChange: onOpenChange,
	});

	return (
		<TooltipContext.Provider value={{ isOpen }}>
			<TooltipPrimitive.Root
				data-slot="tooltip"
				open={isOpen}
				onOpenChange={setIsOpen}
				{...props}
			>
				{children}
			</TooltipPrimitive.Root>
		</TooltipContext.Provider>
	);
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipPortal({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Portal>) {
	return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 4,
	unStyled = false,
	children,
	...props
}: Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "asChild"> & {
	unStyled?: boolean;
}) {
	const { isOpen } = useTooltipContext();

	return (
		<AnimatePresence>
			{isOpen && (
				<TooltipPortal forceMount>
					<TooltipPrimitive.Content
						data-slot="tooltip-content"
						sideOffset={sideOffset}
						{...props}
						asChild
					>
						<motion.div
							initial={{
								opacity: 0,
								scale: 0.8,
								y: 10,
								filter: "blur(4px)",
							}}
							animate={{
								opacity: 1,
								scale: 1,
								filter: "blur(0px)",
								y: 0,
							}}
							exit={{
								opacity: 0,
								scale: 0.8,
								y: 10,
								filter: "blur(4px)",
							}}
							transition={{ duration: 0.2, type: "spring", bounce: 0 }}
							style={{
								boxShadow: !unStyled
									? "inset 0 -12px 16px 0 hsla(0,0%,100%,.06),inset 0 4px 16px 0 hsla(0,0%,100%,.16),inset 0 .75px .25px 0 hsla(0,0%,100%,.12),inset 0 .25px .25px 0 hsla(0,0%,100%,.32),0 40px 24px 0 rgba(0,0,0,.06),0 23px 14px 0 rgba(0,0,0,.08),0 10px 10px 0 rgba(0,0,0,.12),0 3px 6px 0 rgba(0,0,0,.19),0 0 0 .75px rgba(0,0,0,.56)"
									: "",
							}}
							className={cn(
								!unStyled &&
									"z-50 overflow-hidden rounded-xl  bg-slate-950 px-3 py-1.5 text-xs text-white backdrop-blur-md",
								!unStyled &&
									"shadow-[0px_14px_14px_0px_rgba(0,0,0,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.3),0px_0px_0px_1px_rgba(0,0,0,1)]",
								className,
							)}
						>
							{children}
						</motion.div>
					</TooltipPrimitive.Content>
				</TooltipPortal>
			)}
		</AnimatePresence>
	);
}

function TooltipArrow({
	className,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
	return (
		<TooltipPrimitive.Arrow
			data-slot="tooltip-arrow"
			className={cn("fill-gray-900", className)}
			{...props}
		/>
	);
}

export {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	TooltipTrigger,
};
