import {
	type CustomElement,
	type CustomText,
	isCustomText,
	type RichTextContent,
} from "@quickcv/shared-schema";
import type React from "react";
import { cn } from "@/lib/utils";

interface RichTextDisplayProps {
	content: RichTextContent;
	className?: string;
}

const renderTextNode = (node: CustomText, key?: number): React.ReactNode => {
	let text: React.ReactNode = node.text;

	if (node.bold && node.italic) {
		text = (
			<strong key={key}>
				<em>{text}</em>
			</strong>
		);
	} else if (node.bold) {
		text = <strong key={key}>{text}</strong>;
	} else if (node.italic) {
		text = <em key={key}>{text}</em>;
	} else {
		text = <span key={key}>{text}</span>;
	}

	return text;
};

const renderNode = (
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
		return (
			<a key={index} href={element.url} className="text-blue-600">
				{children}
			</a>
		);
	}

	// Handle block elements
	const children = element.children.map((child, childIndex) =>
		renderNode(child, childIndex),
	);

	switch (element.type) {
		case "paragraph":
			return (
				<p key={index} className="min-h-2">
					{children}
				</p>
			);
		case "bulleted-list":
			return (
				<ul key={index} className="list-disc pl-6 my-2">
					{element.children.map((listItem, listIndex) =>
						renderNode(listItem as CustomElement, listIndex),
					)}
				</ul>
			);
		case "numbered-list":
			return (
				<ol key={index} className="list-decimal pl-6 my-2">
					{element.children.map((listItem, listIndex) =>
						renderNode(listItem as CustomElement, listIndex),
					)}
				</ol>
			);
		case "list-item":
			return <li key={index}>{children}</li>;
		default:
			return <p key={index}>{children}</p>;
	}
};

export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
	content,
	className = "",
}) => {
	if (!content || content.length === 0) {
		return null;
	}

	return (
		<div className={cn("text-sm", className)}>
			{content.map((element: CustomElement, index: number) =>
				renderNode(element, index),
			)}
		</div>
	);
};
