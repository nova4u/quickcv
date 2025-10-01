import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={cn(" rounded-xl overflow-hidden", className)}
		style={{
			boxShadow:
				"0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
		}}
		{...props}
	/>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				"group flex flex-1 items-center gap-2 px-4 py-3 text-sm font-medium text-left bg-white hover:bg-gray-50 transition-colors",
				"focus:outline-none  ",
				"data-[state=open]:bg-gray-50",
				className,
			)}
			{...props}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-4 h-4 text-gray-900 group-data-[state=open]:rotate-90 transition-transform duration-200"
				viewBox="0 0 24 24"
				fill="none"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				stroke="currentColor"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
			<span className="text-gray-900">{children}</span>
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

interface AccordionContentProps
	extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
	isOpen?: boolean;
}

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	AccordionContentProps
>(({ className, children, isOpen, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={cn("overflow-hidden text-sm", className)}
		forceMount
		{...props}
	>
		<AnimatePresence initial={false}>
			{isOpen && (
				<motion.div
					initial={{ height: 0 }}
					animate={{ height: "auto" }}
					exit={{ height: 0 }}
					transition={{
						duration: 0.24,
						type: "spring",
						bounce: 0,
						// ease: [0.04, 0.62, 0.23, 0.98],
					}}
					className=" border-t border-gray-100 "
				>
					<div className="p-4">{children}</div>
				</motion.div>
			)}
		</AnimatePresence>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
