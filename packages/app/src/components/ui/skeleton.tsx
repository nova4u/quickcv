import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
	return (
		<div className={`bg-neutral-200 animate-pulse ${className}`} {...props} />
	);
}
