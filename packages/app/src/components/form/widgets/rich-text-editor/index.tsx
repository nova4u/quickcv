import type { RichTextContent } from "@quickcv/shared-schema";
import { defaultRichTextContent } from "@quickcv/shared-schema";
import { useCallback, useMemo } from "react";
import { createEditor, type Descendant, Range, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type CustomRenderElementProps, Element } from "./element";
import { type CustomRenderLeafProps, Leaf } from "./leaf";
import { RenderPlaceholder } from "./placeholder";
import { HoveringToolbar } from "./toolbar";
import { isValidUrl, toggleMark } from "./utils";

export type RichTextEditorProps = {
	value?: RichTextContent;
	id?: string;
	name: string;
	onChange: (value: RichTextContent) => void;
	placeholder?: string;
	label?: string;
	className?: string;
	required?: boolean;
};

/**
 * Rich Text Editor component
 * Single responsibility: Editor orchestration and event handling
 * Follows SOLID principles by composing smaller, focused components
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
	value,
	id,
	onChange,
	placeholder = "Enter text...",
}) => {
	// Create editor instance with configured plugins
	const editor = useMemo(() => {
		const baseEditor = withHistory(withReact(createEditor()));

		// Configure inline elements
		const { isInline } = baseEditor;
		baseEditor.isInline = (element) => {
			// @ts-ignore
			return element.type === "link" ? true : isInline(element);
		};

		return baseEditor;
	}, []);

	const renderElement = useCallback(
		(props: CustomRenderElementProps) => <Element {...props} />,
		[],
	);
	const renderLeaf = useCallback(
		(props: CustomRenderLeafProps) => <Leaf {...props} />,
		[],
	);

	const handleValueChange = useCallback(
		(value: Descendant[]) => onChange(value as RichTextContent),
		[onChange],
	);

	const handleClear = useCallback(() => {
		editor.children.map(() => {
			Transforms.delete(editor, { at: [0] });
		});

		editor.children = [
			{
				type: "paragraph",
				children: [{ text: "" }],
			},
		];
	}, [editor]);

	// Handle keyboard shortcuts
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "Enter" && event.shiftKey) {
				event.stopPropagation();
			}

			if (event.key === "b" && event.metaKey) {
				event.preventDefault();
				toggleMark(editor, "bold");
			}

			if (event.key === "i" && event.metaKey) {
				event.preventDefault();
				toggleMark(editor, "italic");
			}
		},
		[editor],
	);

	// Handle URL pasting to create links
	const onPaste = useCallback(
		(event: React.ClipboardEvent<HTMLDivElement>) => {
			const pastedText = event.clipboardData.getData("text/plain").trim();

			if (isValidUrl(pastedText)) {
				event.preventDefault();

				const { selection } = editor;
				if (!selection) return;

				if (!Range.isCollapsed(selection)) {
					// Wrap selected text in a link
					const linkElement = {
						type: "link" as const,
						url: pastedText,
						children: [],
					};

					Transforms.wrapNodes(editor, linkElement, { split: true });
					Transforms.collapse(editor, { edge: "end" });
				} else {
					// Insert URL as both text and link
					Transforms.insertText(editor, pastedText);

					const insertedTextRange = {
						anchor: {
							path: selection.anchor.path,
							offset: selection.anchor.offset,
						},
						focus: {
							path: selection.anchor.path,
							offset: selection.anchor.offset + pastedText.length,
						},
					};

					Transforms.select(editor, insertedTextRange);

					const linkElement = {
						type: "link" as const,
						url: pastedText,
						children: [],
					};

					Transforms.wrapNodes(editor, linkElement, { split: true });
					Transforms.collapse(editor, { edge: "end" });
				}
			}
		},
		[editor],
	);

	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl transition-shadow duration-200 shadow-input bg-input",
				"[&:has(div[contenteditable=true]:focus,div[contenteditable=true]:hover)]:shadow-input-hover",
			)}
			id={id}
		>
			<Slate
				editor={editor}
				initialValue={(value as Descendant[]) ?? defaultRichTextContent}
				onValueChange={handleValueChange}
			>
				<div className="relative">
					<div className="p-3">
						<HoveringToolbar />
						<Editable
							onKeyDown={onKeyDown}
							onPaste={onPaste}
							renderElement={renderElement}
							renderLeaf={renderLeaf}
							renderPlaceholder={RenderPlaceholder}
							placeholder={placeholder}
							className="min-h-[140px] outline-none text-sm"
						/>
					</div>

					<TooltipProvider delayDuration={300}>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={handleClear}
									className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors duration-150"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
								</button>
							</TooltipTrigger>
							<TooltipContent>Clear content</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</Slate>
		</div>
	);
};
