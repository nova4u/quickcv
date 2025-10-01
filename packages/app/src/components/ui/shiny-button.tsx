import {
	AnimatePresence,
	type HTMLMotionProps,
	motion,
	type Transition,
	type Variants,
} from "motion/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
	isLoading?: boolean;
}
const motionVariants: Variants = {
	hidden: {
		opacity: 0,
		y: -5,
	},
	visible: {
		opacity: 1,
		transition: {
			delay: 0.05,
		},
		y: 0,
	},
	exit: {
		opacity: 0,
		y: 5,
	},
};

const transition: Transition = {
	duration: 0.15,
	type: "spring",
};

export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
	({ children, className, isLoading, ...props }, ref) => {
		return (
			<motion.button
				layout
				layoutDependency={isLoading}
				transition={{
					layout: {
						duration: 0.2,
						type: "spring",
						bounce: 0.1,
					},
				}}
				ref={ref}
				className={cn(
					"shiny-button relative overflow-hidden group inline-flex h-9 cursor-pointer rounded-xl px-10 py-2 text-sm justify-center items-center",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ",
					"disabled:pointer-events-none disabled:opacity-50",
					"animate-hue-shift",
					className,
				)}
				whileTap={{
					scale: 0.98,
					transition: {
						duration: 0.1,
					},
				}}
				style={{ transformOrigin: "right" }}
				{...props}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-transparent transition-none  via-white/50 to-transparent w-full h-full transform -translate-x-full group-hover:translate-x-full group-hover:transition-transform  duration-500 ease-out" />
				<AnimatePresence initial={false} mode="popLayout">
					{isLoading ? (
						<motion.span
							layout="position"
							key="loading"
							variants={motionVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							transition={transition}
							className="flex items-center gap-2 [filter:url(#innerTextShadow)] text-black/40"
						>
							<svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
								<title>Loading...</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Deploying...
						</motion.span>
					) : (
						<motion.span
							layout="position"
							key="content"
							variants={motionVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							transition={transition}
							className="block items-center gap-2 [filter:url(#innerTextShadow)] text-black/40"
						>
							{children as string}
						</motion.span>
					)}
				</AnimatePresence>
			</motion.button>
		);
	},
);

ShinyButton.displayName = "ShinyButton";
