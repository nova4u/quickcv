import type React from "react";
import type { RenderPlaceholderProps } from "slate-react";

export interface CustomRenderPlaceholderProps
	extends Omit<RenderPlaceholderProps, "children"> {
	children: React.ReactNode;
}
export const RenderPlaceholder = ({
	attributes,
	children,
}: CustomRenderPlaceholderProps) => (
	<span {...attributes} className="text-sm min-h-[140px] inline-block">
		{children}
	</span>
);
