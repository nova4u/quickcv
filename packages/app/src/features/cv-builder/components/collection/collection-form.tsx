import type React from "react";
import { useCallback, useRef } from "react";
import type z from "zod";
import { Form, type FormRef } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Shortcut } from "@/components/ui/shortcut";
import { ScreenContent } from "../ui/screen-content";
import { ScreenHeader } from "../ui/screen-header";

export interface CollectionFormProps<T extends z.ZodTypeAny> {
	mode: "add" | "edit";
	defaultValues: z.infer<T>;
	onSubmit: (data: z.infer<T>) => Promise<void> | void;
	onClose: () => void;
	title: string;
	subtitle: string;
	schema: T;
}

export function CollectionForm<T extends z.ZodTypeAny>({
	mode,
	defaultValues,
	onSubmit,
	onClose,
	title,
	subtitle,
	schema,
}: CollectionFormProps<T>) {
	const formRef = useRef<FormRef>(null);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.stopPropagation();
		}

		if (e.key === "Escape") {
			e.preventDefault();
			onClose();
		}

		if (e.key === "Enter") {
			e.preventDefault();
			formRef.current?.submit();
		}
	};

	const focusFirstTextInput = useCallback((node: HTMLDivElement) => {
		if (node) {
			const input = node.querySelector("input[type='text']");
			input instanceof HTMLInputElement && input.focus();
		}
	}, []);

	return (
		<>
			<ScreenHeader
				title={mode === "add" ? `ADD ${title}` : `EDIT ${title}`}
				rightContent={{
					type: "text",
					content: subtitle,
				}}
			/>
			<ScreenContent
				key={`${title.toLowerCase()}-form-content`}
				ref={focusFirstTextInput}
			>
				<Form
					ref={formRef}
					schema={schema}
					defaultValues={defaultValues}
					onSubmit={onSubmit}
					onKeyDown={handleKeyDown}
					className="space-y-6"
				>
					{() => (
						<>
							<p className="text-sm text-gray-500">
								✏️ Tip: Mention your role, experience, skills, and other relevant
								information.
							</p>
							<div className="flex justify-end gap-[14px] pt-4">
								<Button variant="secondary" onClick={onClose}>
									Close
									<Shortcut variant="secondary">Esc</Shortcut>
								</Button>
								<Button type="submit" variant="test">
									Save
									<Shortcut>⏎</Shortcut>
								</Button>
							</div>
						</>
					)}
				</Form>
			</ScreenContent>
		</>
	);
}
