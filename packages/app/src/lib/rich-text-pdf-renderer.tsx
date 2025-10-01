import {
	type CustomElement,
	type CustomText,
	isCustomText,
	type RichTextContent,
} from "@quickcv/shared-schema";
import { Text, View } from "@react-pdf/renderer";
import type React from "react";

const renderPDFNodeInline = (
	node: CustomText | CustomElement,
	key?: number,
): React.ReactElement => {
	if (isCustomText(node)) {
		const style: any = {};

		if (node.bold) {
			style.fontWeight = "bold";
		}

		if (node.italic) {
			style.fontStyle = "italic";
		}

		return (
			<Text key={key} style={style}>
				{node.text}
			</Text>
		);
	}

	// Handle inline elements
	const element = node as CustomElement;
	if (element.type === "link") {
		return (
			<Text key={key} style={{ color: "#6366f1", textDecoration: "underline" }}>
				{element.children.map((child, childIndex) =>
					renderPDFNodeInline(child, childIndex),
				)}
			</Text>
		);
	}

	// Fallback for other inline elements
	return (
		<Text key={key}>
			{/* @ts-ignore */}
			{element.children.map((child: CustomText, childIndex: number) => {
				if (isCustomText(child)) {
					return renderPDFNodeInline(child, childIndex);
				}
				return null;
			})}
		</Text>
	);
};

const renderPDFElement = (
	element: CustomElement,
	key: number,
	baseStyle?: any,
): React.ReactElement => {
	switch (element.type) {
		case "paragraph":
			return (
				<View key={key} style={{ marginBottom: 1, ...baseStyle }}>
					<Text>
						{element.children.map((child, childIndex) =>
							renderPDFNodeInline(child, childIndex),
						)}
					</Text>
				</View>
			);

		case "bulleted-list":
			return (
				<View key={key} style={{ marginBottom: 4, ...baseStyle }}>
					{element.children.map((listItem, listIndex) => (
						<View
							key={`${listIndex}-${listItem.type}`}
							style={{ flexDirection: "row", marginBottom: 2 }}
						>
							<Text style={{ width: 10 }}>•</Text>
							<View style={{ flex: 1 }}>
								<Text>
									{(listItem as any).children?.map(
										(child: CustomText, childIndex: number) =>
											renderPDFNodeInline(child, childIndex),
									)}
								</Text>
							</View>
						</View>
					))}
				</View>
			);

		case "numbered-list":
			return (
				<View key={key} style={{ marginBottom: 4, ...baseStyle }}>
					{element.children.map((listItem, listIndex) => (
						<View
							key={`${listIndex}-${listItem.type}`}
							style={{ flexDirection: "row", marginBottom: 2 }}
						>
							<Text style={{ width: 15 }}>{listIndex + 1}.</Text>
							<View style={{ flex: 1 }}>
								<Text>
									{(listItem as any).children?.map(
										(child: CustomText, childIndex: number) =>
											renderPDFNodeInline(child, childIndex),
									)}
								</Text>
							</View>
						</View>
					))}
				</View>
			);

		case "list-item":
			// This is handled by the parent list
			return (
				<View key={key}>
					<Text>
						{element.children.map((child, childIndex) =>
							renderPDFNodeInline(child, childIndex),
						)}
					</Text>
				</View>
			);

		default:
			return (
				<View key={key} style={baseStyle}>
					<Text>
						{/* @ts-ignore */}
						{element.children.map((child: CustomText, childIndex: number) => {
							if (isCustomText(child)) {
								return renderPDFNodeInline(child, childIndex);
							}
							return null;
						})}
					</Text>
				</View>
			);
	}
};

export const RichTextPDFRenderer: React.FC<{
	content: RichTextContent;
	style?: any;
}> = ({ content, style }) => {
	if (!content || content.length === 0) {
		return null;
	}

	return (
		<View style={style}>
			{content.map((element, index) => renderPDFElement(element, index))}
		</View>
	);
};

export function richTextToPDFText(content: RichTextContent): string {
	const extractText = (element: CustomElement): string => {
		switch (element.type) {
			case "paragraph":
				return element.children
					.map((child) => (isCustomText(child) ? child.text : ""))
					.join("");

			case "bulleted-list":
			case "numbered-list":
				return element.children
					.map((listItem) => `• ${extractText(listItem as CustomElement)}`)
					.join("\n");

			case "list-item":
				return element.children
					.map((child) => {
						if (isCustomText(child)) {
							return child.text;
						}
						return extractText(child as CustomElement);
					})
					.join("");

			case "link":
				return element.children
					.map((child) => (isCustomText(child) ? child.text : ""))
					.join("");
		}
	};

	return content
		.map((element) => extractText(element))
		.join("\n")
		.trim();
}
