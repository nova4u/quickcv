import { parseAsInteger, useQueryState } from "nuqs";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { FORM_STEPS, type FormStep } from "../config";

interface FormNavigationContextType {
	currentStep: number;
	isFirstStep: boolean;
	isLastStep: boolean;
	getProgress: () => number;
	getCurrentStepName: () => FormStep;
	goToStep: (step: number) => void;
	nextStep: () => void;
	prevStep: () => void;
}

const FormNavigationContext = createContext<FormNavigationContextType | null>(
	null,
);

export function FormNavigationProvider({ children }: PropsWithChildren) {
	const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));

	const isFirstStep = step === 0;
	const isLastStep = step === FORM_STEPS.length - 1;

	const getProgress = useCallback(() => {
		return ((step + 1) / FORM_STEPS.length) * 100;
	}, [step]);

	const getCurrentStepName = useCallback(() => {
		return FORM_STEPS[step];
	}, [step]);

	const goToStep = useCallback(
		(newStep: number) => {
			if (newStep >= 0 && newStep < FORM_STEPS.length) {
				setStep(newStep);
			}
		},
		[setStep],
	);

	const nextStep = useCallback(() => {
		if (step < FORM_STEPS.length - 1) {
			setStep(step + 1);
		}
	}, [step, setStep]);

	const prevStep = useCallback(() => {
		if (step > 0) {
			setStep(step - 1);
		}
	}, [step, setStep]);

	const contextValue = useMemo(
		() => ({
			currentStep: step,
			isFirstStep,
			isLastStep,
			getProgress,
			getCurrentStepName,
			goToStep,
			nextStep,
			prevStep,
		}),
		[
			step,
			isFirstStep,
			isLastStep,
			getProgress,
			getCurrentStepName,
			goToStep,
			nextStep,
			prevStep,
		],
	);

	return (
		<FormNavigationContext.Provider value={contextValue}>
			{children}
		</FormNavigationContext.Provider>
	);
}

export function useFormNavigation() {
	const context = useContext(FormNavigationContext);
	if (!context) {
		throw new Error(
			"useFormNavigation must be used within a FormNavigationProvider",
		);
	}
	return context;
}
