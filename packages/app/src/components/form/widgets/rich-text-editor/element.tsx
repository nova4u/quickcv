import type React from "react";
import type { RenderElementProps } from "slate-react";
import type { CustomElement } from "@quickcv/shared-schema";

export interface CustomRenderElementProps
	extends Omit<RenderElementProps, "element"> {
	element: CustomElement;
}

export const Element: React.FC<CustomRenderElementProps> = ({
	attributes,
	children,
	element,
}) => {
	switch (element.type) {
		case "bulleted-list":
			return <ul {...attributes} className="list-disc pl-6 space-y-1">{children}</ul>;
		case "numbered-list":
			return <ol {...attributes} className="list-decimal pl-6 space-y-1">{children}</ol>;
		case "list-item":
			return <li {...attributes}>{children}</li>;
		case "link":
			return (
				<a
					{...attributes}
					href={element.url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-800 underline"
				>
					{children}
				</a>
			);
		default:
			return <p {...attributes}>{children}</p>;
	}
};
