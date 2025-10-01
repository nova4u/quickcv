import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";

interface HoverToolbarButtonProps {
	active: boolean;
	onMouseDown: (event: React.MouseEvent) => void;
	children: React.ReactNode;
}

/**
 * Toolbar button component
 * Single responsibility: Button styling and interaction
 */
const HoverToolbarButton = forwardRef<
	HTMLButtonElement,
	HoverToolbarButtonProps
>(({ active, onMouseDown, children, ...rest }, ref) => (
	<button
		ref={ref}
		type="button"
		className={cn(
			"h-full px-3 rounded-[7px] shadow-[0px_1px_1px_0px_rgba(255,_255,_255,_0.01),_0px_1px_1px_0px_#00000000_inset] data-active:shadow-[0px_1px_1px_0px_rgba(255,_255,_255,_0.10),_0px_1px_5px_0px_#000_inset] hover:shadow-[0px_1px_1px_0px_rgba(255,_255,_255,_0.05),_0px_1px_2px_0px_#00000050_inset] transition-all",
			active
				? "bg-black/40 text-neutral-100"
				: "text-neutral-300 hover:text-neutral-100 hover:bg-black/20",
		)}
		{...(active ? { "data-active": true } : {})}
		onMouseDown={onMouseDown}
		{...rest}
	>
		{children}
	</button>
));

HoverToolbarButton.displayName = "HoverToolbarButton";

/**
 * Hovering toolbar component
 * Single responsibility: Toolbar positioning and rendering
 */
export const HoveringToolbar: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null);
	const editor = useSlate();

	// Position toolbar above selected text
	useEffect(() => {
		const el = ref.current;
		const { selection } = editor;

		if (!el) return;

		if (
			!selection ||
			!ReactEditor.isFocused(editor) ||
			Range.isCollapsed(selection) ||
			Editor.string(editor, selection) === ""
		) {
			el.removeAttribute("style");
			return;
		}

		const domSelection = window.getSelection();
		if (!domSelection || domSelection.rangeCount === 0) return;

		const domRange = domSelection.getRangeAt(0);
		const rect = domRange.getBoundingClientRect();

		el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 8}px`;
		el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
	});

	// Handle outside clicks and escape key
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const editorEl = ReactEditor.toDOMNode(editor, editor);
			const toolbarEl = ref.current;

			if (
				editorEl &&
				!editorEl.contains(event.target as Node) &&
				toolbarEl &&
				!toolbarEl.contains(event.target as Node)
			) {
				Transforms.deselect(editor);
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				Transforms.deselect(editor);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [editor]);

	const { selection } = editor;

	// Hide toolbar when no text is selected
	if (
		!selection ||
		!ReactEditor.isFocused(editor) ||
		Range.isCollapsed(selection) ||
		Editor.string(editor, selection) === ""
	) {
		return null;
	}

	return createPortal(
		<TooltipProvider delayDuration={200}>
			<AnimatePresence>
				<motion.div
					layoutId="hoveringToolbar"
					initial={{ opacity: 0, y: 5, filter: "blur(4px)", scale: 0.7 }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
					transition={{ duration: 0.15, type: "spring" }}
					ref={ref}
					style={{
						boxShadow:
							"inset 0 -12px 16px 0 hsla(0,0%,100%,.06),inset 0 4px 16px 0 hsla(0,0%,100%,.16),inset 0 .75px .25px 0 hsla(0,0%,100%,.12),inset 0 .25px .25px 0 hsla(0,0%,100%,.32),0 40px 24px 0 rgba(0,0,0,.06),0 23px 14px 0 rgba(0,0,0,.08),0 10px 10px 0 rgba(0,0,0,.12),0 3px 6px 0 rgba(0,0,0,.19),0 0 0 .75px rgba(0,0,0,.56)",
					}}
					className={cn(
						"absolute z-50 top-0 left-0 flex",
						"h-9 bg-black/80 rounded-lg shadow-lg",
						"backdrop-blur-sm",
					)}
					onMouseDown={(e) => e.preventDefault()}
				>
					<div className="flex gap-0.5 p-px">
						<Tooltip>
							<TooltipTrigger asChild>
								<HoverToolbarButton
									active={isMarkActive(editor, "bold")}
									onMouseDown={() => toggleMark(editor, "bold")}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-3"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											fillRule="evenodd"
											d="M7.609 1A3.61 3.61 0 0 0 4 4.609V19.94A3.06 3.06 0 0 0 7.059 23H14a6 6 0 0 0 2.102-11.621A6 6 0 0 0 12 1zM12 11a4 4 0 0 0 0-8H7.609C6.72 3 6 3.72 6 4.609V11zm-6 2v6.941C6 20.526 6.474 21 7.059 21H14a4 4 0 0 0 0-8z"
											clipRule="evenodd"
										/>
									</svg>
								</HoverToolbarButton>
							</TooltipTrigger>
							<TooltipContent
								sideOffset={10}
								className="py-1 px-1.5 rounded-md"
							>
								<span className="[text-shadow:0_0_1px_rgba(0,0,0,0.5)]">
									⌘ B
								</span>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<HoverToolbarButton
									active={isMarkActive(editor, "italic")}
									onMouseDown={() => {
										toggleMark(editor, "italic");
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-3"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											fillRule="evenodd"
											d="M14.977 1H9a1 1 0 1 0 0 2h4.656l-5.4 18H3a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-4.656l5.4-18H21a1 1 0 1 0 0-2z"
											clipRule="evenodd"
										/>
									</svg>
								</HoverToolbarButton>
							</TooltipTrigger>
							<TooltipContent
								sideOffset={10}
								className="py-1 px-1.5 rounded-md"
							>
								<span className="[text-shadow:0_0_1px_rgba(0,0,0,0.5)]">
									⌘ I
								</span>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="w-px h-full bg-white/5 shadow-[1px_0px_0px_0px_rgba(0,0,0,0.2)] mx-1" />

					<div className="flex gap-0.5 p-0.5">
						<HoverToolbarButton
							active={isBlockActive(editor, "bulleted-list")}
							onMouseDown={(event) => {
								event.preventDefault();
								toggleBlock(editor, "bulleted-list");
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4"
								viewBox="0 0 32 32"
							>
								<circle cx="7" cy="9" r="3" fill="currentColor" />
								<circle cx="7" cy="23" r="3" fill="currentColor" />
								<path fill="currentColor" d="M16 22h14v2H16zm0-14h14v2H16z" />
							</svg>
						</HoverToolbarButton>
						<HoverToolbarButton
							active={isBlockActive(editor, "numbered-list")}
							onMouseDown={(event) => {
								event.preventDefault();
								toggleBlock(editor, "numbered-list");
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4"
								viewBox="0 0 32 32"
							>
								<path
									fill="currentColor"
									d="M16 22h14v2H16zm0-14h14v2H16zm-8 4V4H6v1H4v2h2v5H4v2h6v-2zm2 16H4v-4a2 2 0 0 1 2-2h2v-2H4v-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6v2h4z"
								/>
							</svg>
						</HoverToolbarButton>
					</div>
				</motion.div>
			</AnimatePresence>
		</TooltipProvider>,
		document.body,
	);
};
