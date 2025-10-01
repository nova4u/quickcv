import type React from "react";
import type { RenderLeafProps } from "slate-react";
import type { CustomText } from "@quickcv/shared-schema";

export interface CustomRenderLeafProps extends Omit<RenderLeafProps, "leaf"> {
	leaf: CustomText;
}

export const Leaf: React.FC<CustomRenderLeafProps> = ({
	attributes,
	children,
	leaf,
}) => {
	let styledChildren = children;

	if (leaf.bold) {
		styledChildren = <strong>{styledChildren}</strong>;
	}

	if (leaf.italic) {
		styledChildren = <em>{styledChildren}</em>;
	}

	return <span {...attributes}>{styledChildren}</span>;
};
