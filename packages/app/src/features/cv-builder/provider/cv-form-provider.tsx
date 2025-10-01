import type { FormData } from "@quickcv/shared-schema";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useRef,
} from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import type { BaseFormState } from "../store/base-form-store";
import {
	createFormStore,
	createPersistedFormStore,
} from "../store/create-form-store";

interface CvFormContextType {
	store: UseBoundStore<StoreApi<BaseFormState>>;
}

const CvFormContext = createContext<CvFormContextType | null>(null);

interface CreateModeProps extends PropsWithChildren {
	mode: "create";
	cvData?: never;
	projectName?: never;
}

interface EditModeProps extends PropsWithChildren {
	mode: "edit";
	cvData: FormData;
	projectName: string;
}

type CvFormProviderProps = CreateModeProps | EditModeProps;

export function CvFormProvider(props: CvFormProviderProps) {
	const storeRef = useRef<UseBoundStore<StoreApi<BaseFormState>> | null>(null);

	if (!storeRef.current) {
		storeRef.current =
			props.mode === "create"
				? createPersistedFormStore()
				: createFormStore(props.cvData, props.projectName);
	}

	return (
		<CvFormContext.Provider value={{ store: storeRef.current }}>
			{props.children}
		</CvFormContext.Provider>
	);
}

export function useCvFormStore<T = BaseFormState>(
	selector?: (state: BaseFormState) => T,
): T {
	const context = useContext(CvFormContext);

	if (!context) {
		throw new Error("useCvFormStore must be used within a CvFormProvider");
	}

	return context.store(selector ?? ((state) => state as T));
}
