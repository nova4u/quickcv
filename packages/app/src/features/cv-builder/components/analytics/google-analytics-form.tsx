import { motion } from "motion/react";
import { FormItem } from "@/components/form/form-item";
import {
	FORM_ANIMATION_TRANSITION,
	FORM_ANIMATION_VARIANTS,
} from "../../constants/animation-constants";
import { ANALYTICS_HELP_TEXT } from "../../constants/analytics-constants";

export function GoogleAnalyticsForm() {
	const { description, privacy, adminUrl } = ANALYTICS_HELP_TEXT.google;

	return (
		<motion.div
			key="google-analytics"
			transition={FORM_ANIMATION_TRANSITION}
			variants={FORM_ANIMATION_VARIANTS}
			initial="hidden"
			exit="exit"
			animate="visible"
			className="space-y-3"
		>
			<FormItem
				name="analytics.googleTrackingId"
				type="text"
				label="Google Analytics Tracking ID"
				placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
			/>
			<p className="text-xs text-gray-500">
				{description.split("Admin → Data Streams")[0]}
				<a
					href={adminUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-800"
				>
					Admin → Data Streams
				</a>{" "}
				(for GA4) or{" "}
				<a
					href={adminUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-800"
				>
					Admin → Property Settings
				</a>{" "}
				(for Universal Analytics)
			</p>
			<div className="p-3 bg-green-50 rounded-md">
				<p className="text-xs text-green-800">{privacy}</p>
			</div>
		</motion.div>
	);
}