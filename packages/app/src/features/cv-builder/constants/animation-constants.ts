import type { Transition, Variants } from "motion/react";

export const FORM_ANIMATION_VARIANTS: Variants = {
	hidden: { opacity: 0, y: -10, filter: "blur(2px)" },
	visible: { opacity: 1, y: 0, filter: "blur(0px)" },
	exit: {
		filter: "blur(2px)",
		opacity: 0,
		y: 10,
		transition: { duration: 0.1, type: "spring", bounce: 0 },
	},
};

export const FORM_ANIMATION_TRANSITION: Transition = {
	duration: 0.2,
	type: "spring",
	bounce: 0,
};