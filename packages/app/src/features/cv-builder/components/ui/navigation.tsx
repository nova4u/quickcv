import clsx from "clsx";
import { motion, type Transition } from "motion/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useFormNavigation } from "../../provider/form-navigation-provider";
import { FORM_STEPS } from "../../store/form-store";

const backgroundTransition: Transition = {
	duration: 0.25,
	type: "spring",
	bounce: 0,
};

const LeftDecorSVG = () => (
	<svg width="45" height="45" viewBox="0 0 45 45" fill="none">
		<path
			d="M45 0C33.2313 0.518766 23.8114 10.0786 23.5115 21.9069L23.4961 23.0699C23.1878 35.2339 13.2341 45 1 45H45V0Z"
			fill="var(--bg-color)"
		/>
	</svg>
);

const RightDecorSVG = () => (
	<svg width="45" height="45" viewBox="0 0 45 45" fill="none">
		<path
			d="M4.19617e-05 0C11.7687 0.518766 21.1886 10.0786 21.4885 21.9069L21.5039 23.0699C21.8122 35.2339 31.7659 45 44 45H4.19617e-05V0Z"
			fill="var(--bg-color)"
		/>
	</svg>
);

const Indicator = memo<{
	isFirst: boolean;
	isLast: boolean;
}>(({ isFirst, isLast }) => (
	<motion.div
		layoutId="tab-background"
		className="absolute inset-0"
		transition={backgroundTransition}
	>
		<div className="relative w-full h-[45px]">
			<div
				className={clsx(
					" absolute inset-0 bg-[var(--bg-color)] transition-all duration-300",
					{
						"rounded-tl-[20px]": isFirst,
						"rounded-tr-[20px]": isLast,
					},
				)}
			/>

			<motion.div
				className="absolute top-0 will-change-transform"
				initial={false}
				animate={{
					opacity: isFirst ? 0 : 1,
					x: isFirst ? 0 : "-100%",
				}}
				transition={backgroundTransition}
			>
				<LeftDecorSVG />
			</motion.div>

			<motion.div
				className="absolute top-0 right-0 will-change-transform"
				initial={false}
				animate={{
					opacity: isLast ? 0 : 1,
					x: isLast ? 0 : "100%",
				}}
				transition={backgroundTransition}
			>
				<RightDecorSVG />
			</motion.div>
		</div>
	</motion.div>
));
Indicator.displayName = "Indicator";

const Navigation: React.FC = () => {
	const { currentStep, goToStep } = useFormNavigation();

	return (
		<div
			className="overflow-x-scroll scroll-smooth snap-x snap-mandatory hidden-scrollbar"
			role="tablist"
			aria-label="Portfolio sections"
		>
			<div className="flex justify-between gap-4 px-4 sm:px-0">
				{FORM_STEPS.map((name, index) => {
					const isActive = index === currentStep;

					const isLast = index === FORM_STEPS.length - 1;
					const isFirst = index === 0;

					return (
						<motion.button
							onClick={() => goToStep(index)}
							key={name}
							role="tab"
							aria-selected={isActive}
							aria-controls={`tabpanel-${index}`}
							tabIndex={isActive ? 0 : -1}
							id={`tab-${index}`}
							className={cn(
								"px-6  py-2.5 font-medium tracking-tight rounded-tl-2xl rounded-tr-2xl inline-flex justify-center items-center gap-2.5 relative snap-start",
								"flex-shrink-0 transition-colors duration-200",
								isActive
									? "text-gray-900"
									: "text-gray-600 hover:text-gray-800",
							)}
							style={{ willChange: isActive ? "auto" : "transform" }}
						>
							{isActive && <Indicator isFirst={isFirst} isLast={isLast} />}
							<span className="relative z-10">{name}</span>
						</motion.button>
					);
				})}
			</div>
		</div>
	);
};

export default memo(Navigation);
