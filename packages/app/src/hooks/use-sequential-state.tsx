import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A useState variant whose setter never fires more often than `delayMs`.
 * @param initialValue  initial state value
 * @param delayMs       minimum ms between updates
 */
export function useSequentialState<T>(
	initialValue: T,
	minDelayMs = 500,
): [T, (next: T) => void] {
	const [state, setState] = useState(initialValue);
	const queueRef = useRef<Promise<unknown>>(Promise.resolve());
	const isMountedRef = useRef(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Handle component unmounting
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const enqueue = useCallback(
		(next: T) => {
			// chain onto the existing queue
			queueRef.current = queueRef.current
				.then(() => {
					// Only update state if component is still mounted
					if (isMountedRef.current) {
						setState(next);
						console.log(`setting to ${next}`);
						// wait before allowing the next queued update
						return new Promise<void>((res) => {
							timeoutRef.current = setTimeout(() => {
								if (isMountedRef.current) {
									res();
								}
							}, minDelayMs);
						});
					}
				})
				.catch(() => {
					console.log("error");
				});
		},
		[minDelayMs],
	);

	return [state, enqueue];
}
