export default function extractTailwindClasses(html: string) {
	const classRegex = /class="([^"]*)"/g;
	const classes = new Set<string>();

	let match: RegExpExecArray | null;
	// biome-ignore lint/suspicious/noAssignInExpressions: Required for regex matching
	while ((match = classRegex.exec(html)) !== null) {
		const classString = match[1];
		const classList = classString.split(/\s+/).filter((cls) => cls.length > 0);
		classList.forEach((cls) => classes.add(cls));
	}

	return Array.from(classes);
}
