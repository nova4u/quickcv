import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

type ChangeHandler<T> = (state: T) => void;
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

interface UseControllableStateParams<T> {
	prop?: T | undefined;
	defaultProp: T;
	onChange?: ChangeHandler<T>;
}

/**
 * Modified version of Radix UI's useControllableState hook
 * A custom hook that provides a way to manage state that can be controlled by a parent component.
 * @see https://github.com/radix-ui/primitives/blob/79304015e13a31bc465545fa1d20e743a0bce3c5/packages/react/use-controllable-state/src/use-controllable-state.tsx#L18
 */

export function useControllableState<T>({
	prop,
	defaultProp,
	onChange = () => {},
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] =
		useUncontrolledState({
			defaultProp,
			onChange,
		});
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledProp;

	const setValue = useCallback<SetStateFn<T>>(
		(nextValue) => {
			if (isControlled) {
				const value = isFunction(nextValue) ? nextValue(prop) : nextValue;
				if (value !== prop) {
					onChangeRef.current?.(value);
				}
			} else {
				setUncontrolledProp(nextValue);
			}
		},
		[isControlled, prop, setUncontrolledProp, onChangeRef],
	);

	return [value, setValue];
}

function useUncontrolledState<T>({
	defaultProp,
	onChange,
}: Omit<UseControllableStateParams<T>, "prop">): [
	Value: T,
	setValue: React.Dispatch<React.SetStateAction<T>>,
	OnChangeRef: React.RefObject<ChangeHandler<T> | undefined>,
] {
	const [value, setValue] = useState(defaultProp);
	const prevValueRef = useRef(value);
	const onChangeRef = useRef(onChange);

	useLayoutEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value]);

	return [value, setValue, onChangeRef];
}

// biome-ignore lint/suspicious/noExplicitAny: This is a utility function
function isFunction(value: unknown): value is (...args: any[]) => any {
	return typeof value === "function";
}
