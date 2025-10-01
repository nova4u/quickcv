import { type MotionProps, motion } from "motion/react";
import { forwardRef, type PropsWithChildren } from "react";

export const screenContentVariant = {
	initial: {
		filter: "blur(2px)",
		y: 5,
		opacity: 0,
	},
	animate: {
		filter: "blur(0px)",
		y: 0,
		opacity: 1,
		transition: {
			bounce: 0,
			duration: 0.1,
			delay: 0.05,
		},
	},
	exit: {
		filter: "blur(2px)",
		y: -10,
		opacity: 0,
		transition: {
			bounce: 0,
			duration: 0.1,
		},
	},
};

export const ScreenContent = forwardRef<
	HTMLDivElement,
	PropsWithChildren<MotionProps>
>(({ children, ...motionProps }, ref) => {
	return (
		<motion.div
			ref={ref}
			className="space-y-6 mt-6"
			variants={screenContentVariant}
			style={{
				transformOrigin: "top",
			}}
			initial="initial"
			animate="animate"
			exit="exit"
			{...motionProps}
		>
			{children}
		</motion.div>
	);
});
