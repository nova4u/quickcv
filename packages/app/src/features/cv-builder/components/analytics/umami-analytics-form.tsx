import { motion } from "motion/react";
import { FormItem } from "@/components/form/form-item";
import {
	FORM_ANIMATION_TRANSITION,
	FORM_ANIMATION_VARIANTS,
} from "../../constants/animation-constants";
import { ANALYTICS_HELP_TEXT } from "../../constants/analytics-constants";

export function UmamiAnalyticsForm() {
	const { description, dashboardUrl } = ANALYTICS_HELP_TEXT.umami;

	return (
		<motion.div
			key="umami-analytics"
			variants={FORM_ANIMATION_VARIANTS}
			transition={FORM_ANIMATION_TRANSITION}
			initial="hidden"
			exit="exit"
			animate="visible"
			className="space-y-3"
		>
			<FormItem
				name="analytics.umamiWebsiteId"
				type="text"
				label="Umami Website ID"
				placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
			/>
			<p className="text-xs text-gray-500">
				{description.split("Settings → Websites")[0]}
				<a
					href={dashboardUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-800"
				>
					Settings → Websites
				</a>
			</p>
		</motion.div>
	);
}