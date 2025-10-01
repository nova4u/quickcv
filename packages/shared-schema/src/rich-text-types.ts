export interface ParagraphElement {
	type: "paragraph";
	children: CustomText[];
}

export interface BulletedListElement {
	type: "bulleted-list";
	children: ListItemElement[];
}

export interface NumberedListElement {
	type: "numbered-list";
	children: ListItemElement[];
}

export interface ListItemElement {
	type: "list-item";
	children: (ParagraphElement | CustomText)[];
}

export interface LinkElement {
	type: "link";
	url: string;
	children: CustomText[];
}

export type CustomElement =
	| ParagraphElement
	| BulletedListElement
	| NumberedListElement
	| ListItemElement
	| LinkElement;

export interface CustomText {
	text: string;
	bold?: boolean;
	italic?: boolean;
}

export type RichTextNode = CustomElement | CustomText;
export type RichTextContent = CustomElement[];

export const defaultRichTextContent: RichTextContent = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

export function isCustomText(node: RichTextNode): node is CustomText {
	return "text" in node;
}

export function isCustomElement(node: RichTextNode): node is CustomElement {
	return "type" in node;
}

export function richTextToPlainText(content: RichTextContent): string {
	const extractTextFromNode = (node: CustomElement | CustomText): string => {
		if (isCustomText(node)) {
			return node.text;
		}

		// Handle other elements recursively
		return node.children.map((child) => extractTextFromNode(child)).join("");
	};

	return content.map((element) => extractTextFromNode(element)).join("\n");
}
