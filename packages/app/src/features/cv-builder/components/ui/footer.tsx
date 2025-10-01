import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormNavigation } from "../../provider/form-navigation-provider";

const ScreenFooter: React.FC<{ className?: string }> = ({ className }) => {
	const { isFirstStep, nextStep, prevStep } = useFormNavigation();

	return (
		<div
			className={cn(
				"rounded-b-[20px]  items-center px-[26px] py-2 gap-2.5 grid grid-cols-2 justify-between",
				className,
			)}
		>
			{!isFirstStep && (
				<button
					type="button"
					className={cn(
						"flex items-center gap-2.5 group transition-colors col-start-1 text-black/30 hover:text-black/80 cursor-pointer",
					)}
					onClick={prevStep}
				>
					<span
						className="text-sm font-medium leading-[1.25em] tracking-[-0.03em] [filter:url(#innerTextShadow)]"
						style={{
							textShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.35)",
						}}
					>
						Back
					</span>
				</button>
			)}

			<div className="flex items-center gap-[14px] col-start-2 justify-self-end">
				<Button variant="test" onClick={nextStep}>
					Continue
				</Button>
			</div>
		</div>
	);
};

export default ScreenFooter;
