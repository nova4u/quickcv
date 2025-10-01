import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean;
	htmlFor?: string;
	asChild?: boolean;
}

export const formLabelVariants = cva(
	"text-[13px] font-normal leading-[1.54em] tracking-[-0.02em] text-black/57",
);

function FormLabel({
	required,
	children,
	className,
	asChild = false,
	...props
}: FormLabelProps) {
	const Comp = asChild ? Slot : "label";
	return (
		<Comp className={cn(formLabelVariants(), className)} {...props}>
			{children}{" "}
			{required && (
				<span className="text-red-500 text-[10px] align-top">*</span>
			)}
		</Comp>
	);
}

export default FormLabel;
