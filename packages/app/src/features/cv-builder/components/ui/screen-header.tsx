import { motion, type Variants } from "motion/react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
	title: string;
	className?: string;
	rightContent?:
		| {
				type: "text";
				content: string;
		  }
		| {
				type: "button";
				content: string;
				onClick?: () => void;
		  };
}
const variants: Variants = {
	initial: {
		opacity: 0,
		y: 5,
		filter: "blur(2px)",
	},
	animate: { opacity: 1, y: 0, filter: "blur(0px)" },
	exit: {
		opacity: 0,
		y: -5,
		filter: "blur(2px)",
		transition: { duration: 0.1 },
	},
};

const titleVariants: Variants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.01,
		},
	},
};

const charVariants: Variants = {
	initial: {
		opacity: 0,
		y: 8,
		filter: "blur(1px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			duration: 0.15,
			type: "spring",
			bounce: 0.1,
		},
	},
};

export const ScreenHeader = ({
	title,
	className,
	rightContent,
	children,
}: PropsWithChildren<ScreenHeaderProps>) => {
	return (
		<motion.div
			key={title}
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
			className={cn(
				"flex-col md:flex-row flex md:items-center justify-between w-full gap-3 origin-left min-h-9",
				className,
			)}
			// transition={{ duration: 0.1, type: "spring", bounce: 0 }}
		>
			<motion.h3
				className="text-sm font-semibold leading-[1.43em] tracking-[0.1em] text-black/77 uppercase"
				variants={titleVariants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				{title.split("").map((char, index) => (
					<motion.span
						key={`${char}-${index}-${title}`}
						variants={charVariants}
						style={{
							display: "inline-block",
						}}
					>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				))}
			</motion.h3>

			{rightContent && (
				<>
					{rightContent.type === "text" && (
						<span className="text-sm font-normal leading-[1.43em] tracking-[-0.02em] text-black/57 md:text-right">
							{rightContent.content}
						</span>
					)}

					{rightContent.type === "button" && (
						<div className="flex gap-2">
							<Button variant="secondary" onClick={rightContent.onClick}>
								{rightContent.content}
							</Button>
						</div>
					)}
				</>
			)}
			{children}
		</motion.div>
	);
};
