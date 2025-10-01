import { motion } from "motion/react";
import {
	FORM_ANIMATION_TRANSITION,
	FORM_ANIMATION_VARIANTS,
} from "../../constants/animation-constants";
import { ANALYTICS_HELP_TEXT } from "../../constants/analytics-constants";

export function VercelAnalyticsNotice() {
	const { description } = ANALYTICS_HELP_TEXT.vercel;

	return (
		<motion.div
			key="vercel-analytics"
			variants={FORM_ANIMATION_VARIANTS}
			transition={FORM_ANIMATION_TRANSITION}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="p-3 bg-blue-50 rounded-md"
		>
			<p className="text-xs text-blue-800">{description}</p>
		</motion.div>
	);
}