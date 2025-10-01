import { AnimatePresence } from "motion/react";
import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { AnalyticsOptions } from "./analytics-options";
import { GoogleAnalyticsForm } from "./google-analytics-form";
import { UmamiAnalyticsForm } from "./umami-analytics-form";
import { VercelAnalyticsNotice } from "./vercel-analytics-notice";

interface AnalyticsSectionProps {
	analyticsType: string;
}

export function AnalyticsSection({ analyticsType }: AnalyticsSectionProps) {
	const [isOpen, setIsOpen] = React.useState(true);

	return (
		<Accordion
			type="single"
			collapsible
			className="w-full"
			value={isOpen ? "analytics" : ""}
			onValueChange={(value) => setIsOpen(value === "analytics")}
		>
			<AccordionItem value="analytics">
				<AccordionTrigger>Analytics</AccordionTrigger>
				<AccordionContent isOpen={isOpen}>
					<div className="space-y-4">
						<AnalyticsOptions />

						<AnimatePresence mode="popLayout">
							{analyticsType === "google" && <GoogleAnalyticsForm />}
							{analyticsType === "umami" && <UmamiAnalyticsForm />}
							{analyticsType === "vercel" && <VercelAnalyticsNotice />}
						</AnimatePresence>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
