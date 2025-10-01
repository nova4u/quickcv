import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { createContext, useContext, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipPopoverContext = createContext<{
	isPopoverOpen: boolean;
	isTooltipOpen: boolean;
	handlePopoverChange: (open: boolean) => void;
	handleTooltipChange: (open: boolean) => void;
} | null>(null);

function useTooltipPopoverContext() {
	const context = useContext(TooltipPopoverContext);
	if (!context) {
		throw new Error(
			"TooltipPopover components must be used within a TooltipPopover",
		);
	}
	return context;
}

interface TooltipPopoverProps {
	children: React.ReactNode;
	delayDuration?: number;
}

function TooltipPopover({
	children,
	delayDuration = 300,
}: TooltipPopoverProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);
	const [canShowTooltip, setCanShowTooltip] = useState(true);

	// When popover state changes, always hide tooltip
	const handlePopoverChange = (open: boolean) => {
		setIsPopoverOpen(open);
		setIsTooltipOpen(false);

		// If popover is closing, prevent tooltip from showing for a brief moment
		if (!open) {
			setCanShowTooltip(false);
			setTimeout(() => {
				setCanShowTooltip(true);
			}, 150); // Small delay to prevent refocus tooltip
		}
	};

	const handleTooltipChange = (open: boolean) => {
		if (open && !canShowTooltip) {
			return;
		}
		setIsTooltipOpen(open);
	};

	return (
		<TooltipProvider delayDuration={delayDuration}>
			<TooltipPopoverContext.Provider
				value={{
					isPopoverOpen,
					isTooltipOpen,
					handlePopoverChange,
					handleTooltipChange,
				}}
			>
				<Tooltip open={isTooltipOpen} onOpenChange={handleTooltipChange}>
					<Popover.Root open={isPopoverOpen} onOpenChange={handlePopoverChange}>
						{children}
					</Popover.Root>
				</Tooltip>
			</TooltipPopoverContext.Provider>
		</TooltipProvider>
	);
}

function TooltipPopoverTrigger({
	children,
	...props
}: React.ComponentProps<typeof Popover.Trigger>) {
	return (
		<TooltipTrigger asChild>
			<Popover.Trigger asChild {...props}>
				{children}
			</Popover.Trigger>
		</TooltipTrigger>
	);
}

function TooltipPopoverTooltipContent({
	children,
	...props
}: React.ComponentProps<typeof TooltipContent>) {
	return <TooltipContent {...props}>{children}</TooltipContent>;
}

interface TooltipPopoverContentProps {
	children: React.ReactNode;
	className?: string;
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
}

function TooltipPopoverContent({
	children,
	className = "z-50 w-60 rounded-2xl bg-white py-4 px-5 shadow-2xl",
	align = "center",
	side = "bottom",
	sideOffset = 5,
}: TooltipPopoverContentProps) {
	const { isPopoverOpen } = useTooltipPopoverContext();

	return (
		<AnimatePresence>
			{isPopoverOpen && (
				<Popover.Portal forceMount>
					<Popover.Content
						className={className}
						align={align}
						side={side}
						sideOffset={sideOffset}
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
									duration: 0.1,
									bounce: 0.1,
								},
							}}
							transition={{
								type: "spring",
								duration: 0.15,
								bounce: 0.1,
							}}
							style={{
								transformOrigin:
									"var(--radix-popover-content-transform-origin)",
							}}
						>
							{children}
						</motion.div>
					</Popover.Content>
				</Popover.Portal>
			)}
		</AnimatePresence>
	);
}

function TooltipPopoverClose({
	children,
	...props
}: React.ComponentProps<typeof Popover.Close>) {
	return <Popover.Close {...props}>{children}</Popover.Close>;
}

export {
	TooltipPopover,
	TooltipPopoverClose,
	TooltipPopoverContent,
	TooltipPopoverTooltipContent,
	TooltipPopoverTrigger,
};
