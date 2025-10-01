import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	forwardRef,
} from "react";
import { cn } from "@/lib/utils";

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay data-slot="dialog-overlay" asChild {...props}>
			<motion.div
				initial={{
					opacity: 0,
				}}
				animate={{
					opacity: 1,
				}}
				exit={{
					opacity: 0,
				}}
				transition={{ duration: 0.1 }}
				className={cn(
					"fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
					className,
				)}
			/>
		</DialogPrimitive.Overlay>
	);
}

const DialogContent = forwardRef<
	ElementRef<typeof DialogPrimitive.Content>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { isOpen: boolean }
>(({ children, isOpen, ...props }, ref) => (
	<DialogPortal data-slot="dialog-portal" forceMount>
		<AnimatePresence initial={false}>
			{isOpen && (
				<>
					<DialogOverlay />
					<DialogPrimitive.Content
						ref={ref}
						data-slot="dialog-content"
						{...props}
					>
						{children}
					</DialogPrimitive.Content>
				</>
			)}
		</AnimatePresence>
	</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
