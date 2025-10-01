import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import Navigation from "../components/ui/navigation";
import { TABS } from "../config";
import { useFormNavigation } from "../provider/form-navigation-provider";
import { FORM_STEPS } from "../store/form-store";

interface CvBuilderContentProps {
	className?: string;
	icon?: () => React.ReactNode;
	containerClassName?: string;
	footer?: React.ReactNode;
}

/**
 * Shared CV Builder content component used by both create and edit modes.
 * Contains the common UI structure and logic.
 */
export function CvBuilderContent({
	className,
	containerClassName,
}: CvBuilderContentProps) {
	const { currentStep } = useFormNavigation();

	const Footer = TABS[currentStep]?.footer;
	const CurrentScreen = TABS[currentStep].screen;

	return (
		<div
			className={[
				"max-w-window w-full mx-auto px-1 [--bg-color:#00000017] ",
				className,
			].join(" ")}
		>
			<Navigation />

			<div
				className={cn(
					"bg-[var(--bg-color)] [--radius:24px] [--padding:2px]  rounded-b-[var(--radius)] p-[var(--padding)] transition-[border-radius] duration-300 isolate",
					currentStep !== FORM_STEPS.length - 1 && "rounded-tr-[var(--radius)]",
					currentStep !== 0 && "rounded-tl-[var(--radius)]",
				)}
			>
				<motion.div
					className={[
						"bg-white relative p-4 md:p-6 overflow-hidden",
						containerClassName,
					].join(" ")}
					role="tabpanel"
					style={{
						borderRadius: "22px",
						boxShadow:
							"0px 8px 8px -4px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
					}}
					transition={{}}
					layoutDependency={currentStep}
					id={`tabpanel-${currentStep}`}
					aria-labelledby={`tab-${currentStep}`}
				>
					<AnimatePresence mode="popLayout">
						<motion.div layout="position" key={`step-${currentStep}`}>
							<CurrentScreen />
						</motion.div>
					</AnimatePresence>
				</motion.div>
				{Footer && <Footer />}
			</div>
		</div>
	);
}
