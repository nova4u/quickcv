import type { CustomElement, CustomText } from "@quickcv/shared-schema";
import type { BaseEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

declare module "slate" {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor & HistoryEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}
