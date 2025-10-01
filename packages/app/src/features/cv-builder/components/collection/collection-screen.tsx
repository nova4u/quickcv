import { useState } from "react";
import type z from "zod";
import { ScreenContent } from "../ui/screen-content";
import { ScreenHeader } from "../ui/screen-header";
import { CollectionForm } from "./collection-form";

export interface CollectionScreenProps<
	T extends z.ZodTypeAny,
	D extends z.infer<T> = z.infer<T>,
> {
	items: D[];
	updateItems: (items: D[]) => void;
	itemSchema: T;
	defaultItem: D;
	listComponent: React.ComponentType<{
		items: D[];
		onEdit: (index: number) => void;
		onDelete: (index: number) => void;
		onAddNew: () => void;
	}>;
	screenTitle: string;
	addButtonText: string;
	formTitle: string;
	formSubtitle: string;
}

function sortItemsByDate<
	T extends { dates: { current: boolean; startDate: string } },
>(items: T[]): T[] {
	return [...items].sort((a, b) => {
		if (a.dates.current && !b.dates.current) return -1;
		if (!a.dates.current && b.dates.current) return 1;

		return b.dates.startDate.localeCompare(a.dates.startDate);
	});
}

export function CollectionScreen<
	T extends z.ZodTypeAny,
	D extends z.infer<T> = z.infer<T>,
>({
	items,
	updateItems,
	defaultItem,
	itemSchema,
	listComponent: ListComponent,
	screenTitle,
	addButtonText,
	formTitle,
	formSubtitle,
}: CollectionScreenProps<T, D>) {
	const [mode, setMode] = useState<"list" | "add" | "edit">(
		items.length === 0 ? "add" : "list",
	);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [currentItem, setCurrentItem] = useState<D>(defaultItem);

	const handleAddNew = () => {
		setEditingIndex(null);
		setCurrentItem(defaultItem);
		setMode("add");
	};

	const handleEdit = (index: number) => {
		const item = items[index];
		setCurrentItem(item);
		setEditingIndex(index);
		setMode("edit");
	};

	const saveItem = async (formData: D) => {
		const newItem = {
			...formData,
			current: formData.current || false,
		} as D;

		const updatedItems =
			editingIndex !== null
				? items.map((item, i) => (i === editingIndex ? newItem : item))
				: [...items, newItem];

		// Sort items by date before updating - cast for type safety
		const sortedItems = sortItemsByDate(updatedItems);
		updateItems(sortedItems as D[]);

		setMode("list");
		setEditingIndex(null);
		setCurrentItem(defaultItem);
	};

	const deleteItem = (index: number) => {
		const updatedItems = items.filter((_, i) => i !== index);
		updateItems(updatedItems);

		if (updatedItems.length === 0) {
			setMode("add");
		}
	};

	const handleClose = () => {
		if (items.length === 0) {
			return;
		}
		setMode("list");
		setEditingIndex(null);
		setCurrentItem(defaultItem);
	};

	if (mode === "add" || mode === "edit") {
		return (
			<CollectionForm
				mode={mode}
				defaultValues={currentItem}
				schema={itemSchema}
				title={formTitle}
				subtitle={formSubtitle}
				onSubmit={saveItem}
				onClose={handleClose}
			/>
		);
	}

	return (
		<>
			<ScreenHeader
				title={screenTitle}
				rightContent={{
					type: "button",
					content: addButtonText,
					onClick: handleAddNew,
				}}
			/>
			<ScreenContent key={`${screenTitle.toLowerCase()}-list-content`}>
				<ListComponent
					items={items}
					onEdit={handleEdit}
					onDelete={deleteItem}
					onAddNew={handleAddNew}
				/>
			</ScreenContent>
		</>
	);
}
