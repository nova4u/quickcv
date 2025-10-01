import type { CustomElement, CustomText } from "@quickcv/shared-schema";
import { Editor, Element as SlateElement, Transforms } from "slate";

/**
 * Validates if a string is a valid URL
 * Single responsibility: URL validation
 */
export const isValidUrl = (string: string): boolean => {
	try {
		new URL(string);
		return true;
	} catch {
		return false;
	}
};

/**
 * Checks if a text mark is active in the current selection
 * Single responsibility: Mark state checking
 */
export const isMarkActive = (
	editor: Editor,
	format: keyof Omit<CustomText, "text">,
): boolean => {
	const marks = Editor.marks(editor);
	return marks ? (marks as Record<string, boolean>)[format] === true : false;
};

/**
 * Toggles a text mark (bold, italic, etc.) in the current selection
 * Single responsibility: Mark toggling
 */
export const toggleMark = (
	editor: Editor,
	format: keyof Omit<CustomText, "text">,
): void => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

/**
 * Checks if a block type is active in the current selection
 * Single responsibility: Block state checking
 */
export const isBlockActive = (
	editor: Editor,
	format: CustomElement["type"],
): boolean => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n) =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				// @ts-ignore
				n.type === format,
		}),
	);

	return !!match;
};

/**
 * Toggles a block type (list, heading, etc.) in the current selection
 * Single responsibility: Block toggling
 */
export const toggleBlock = (
	editor: Editor,
	format: CustomElement["type"],
): void => {
	const isActive = isBlockActive(editor, format);
	const isList = format === "bulleted-list" || format === "numbered-list";

	Transforms.unwrapNodes(editor, {
		match: (n) =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			// @ts-ignore
			(n.type === "bulleted-list" || n.type === "numbered-list"),
		split: true,
	});

	let newProperties: Partial<CustomElement>;
	if (isActive) {
		newProperties = { type: "paragraph" };
	} else if (isList) {
		newProperties = { type: "list-item" };
	} else {
		newProperties = { type: format };
	}

	Transforms.setNodes<CustomElement>(editor, newProperties);

	if (!isActive && isList) {
		const block: CustomElement = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

/**
 * Initial empty content for the editor
 * Declarative data structure
 */
export const initialValue = [
	{
		type: "paragraph" as const,
		children: [{ text: "" }],
	},
];
