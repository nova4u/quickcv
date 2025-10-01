import { cn } from "@/lib/utils";

interface NotFoundDocumentProps {
	className?: string;
}

export function NotFoundDocument({ className }: NotFoundDocumentProps) {
	return (
		<div className={cn("flex md:items-center md:justify-center", className)}>
			{/* Document Icon with 404 */}
			<div className="relative w-16 h-18 bg-white shadow-lg  rounded-sm">
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-2xl font-medium text-gray-400">404</span>
				</div>
			</div>
		</div>
	);
}
