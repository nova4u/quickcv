import {
	type CustomElement,
	type CustomText,
	isCustomText,
	type RichTextContent,
} from "@quickcv/shared-schema";
import React from "react";

export const renderTextNode = (
	node: CustomText,
	key?: number,
): React.ReactNode => {
	let text: React.ReactNode = node.text;

	if (node.bold && node.italic) {
		text = React.createElement(
			"strong",
			{ key },
			React.createElement("em", {}, text),
		);
	} else if (node.bold) {
		text = React.createElement("strong", { key }, text);
	} else if (node.italic) {
		text = React.createElement("em", { key }, text);
	} else {
		text = React.createElement("span", { key }, text);
	}

	return text;
};

export const renderNode = (
	node: CustomElement | CustomText,
	index: number,
): React.ReactNode => {
	if (isCustomText(node)) {
		return renderTextNode(node, index);
	}

	const element = node as CustomElement;

	// Handle inline elements
	if (element.type === "link") {
		const children = element.children.map((child, childIndex) =>
			renderNode(child, childIndex),
		);
		return React.createElement(
			"a",
			{ key: index, href: element.url, className: "text-blue-600" },
			children,
		);
	}

	// Handle block elements
	const children = element.children.map((child, childIndex) =>
		renderNode(child, childIndex),
	);

	switch (element.type) {
		case "paragraph":
			return React.createElement(
				"p",
				{ key: index, className: "min-h-2" },
				children,
			);
		case "bulleted-list":
			return React.createElement(
				"ul",
				{ key: index, className: "list-disc pl-6 my-2" },
				element.children.map((listItem, listIndex) =>
					renderNode(listItem as CustomElement, listIndex),
				),
			);
		case "numbered-list":
			return React.createElement(
				"ol",
				{ key: index, className: "list-decimal pl-6 my-2" },
				element.children.map((listItem, listIndex) =>
					renderNode(listItem as CustomElement, listIndex),
				),
			);
		case "list-item":
			return React.createElement("li", { key: index }, children);
		default:
			return React.createElement("p", { key: index }, children);
	}
};

export const renderRichTextContent = (
	content: RichTextContent,
): React.ReactNode[] => {
	if (!content || content.length === 0) {
		return [];
	}

	return content.map((element: CustomElement, index: number) =>
		renderNode(element, index),
	);
};
