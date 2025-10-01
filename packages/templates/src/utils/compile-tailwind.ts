import init, {
	type CustomAtRules,
	Features,
	type TransformOptions,
	transform,
} from "lightningcss-wasm";
import { compile } from "tailwindcss";
import tailwindStyles from "../styles.css?raw";
import { css } from "./css";

async function loadModule(): Promise<never> {
	throw new Error(
		"The browser build does not support plugins or config files.",
	);
}

async function loadStylesheet(id: string, base: string) {
	function load() {
		if (id === "tailwindcss") {
			return {
				path: "virtual:tailwindcss/index.css",
				base,
				content: css.index,
			};
		}

		if (
			id === "tailwindcss/preflight" ||
			id === "tailwindcss/preflight.css" ||
			id === "./preflight.css"
		) {
			return {
				path: "virtual:tailwindcss/preflight.css",
				base,
				content: css.preflight,
			};
		}

		if (
			id === "tailwindcss/theme" ||
			id === "tailwindcss/theme.css" ||
			id === "./theme.css"
		) {
			return {
				path: "virtual:tailwindcss/theme.css",
				base,
				content: css.theme,
			};
		}

		if (
			id === "tailwindcss/utilities" ||
			id === "tailwindcss/utilities.css" ||
			id === "./utilities.css"
		) {
			return {
				path: "virtual:tailwindcss/utilities.css",
				base,
				content: css.utilities,
			};
		}

		throw new Error(`The browser build does not support @import for "${id}"`);
	}
	try {
		console.log(id, base);
		const sheet = load();
		return sheet;
	} catch (error) {
		throw error;
	}
}

export default async function compileTailwind(
	classes: string[],
	options?: Partial<TransformOptions<CustomAtRules> & { darkMode?: boolean }>,
) {
	await init();

	const compiler = await compile(
		tailwindStyles +
			(options?.darkMode
				? ""
				: "\n@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));"),
		{
			loadModule,
			loadStylesheet,
		},
	);

	const rawCss = compiler.build(classes);

	try {
		return new TextDecoder().decode(
			transform({
				filename: "style.css",
				minify: false,
				drafts: {
					customMedia: true,
				},
				nonStandard: {
					deepSelectorCombinator: true,
				},
				include: Features.Nesting,
				exclude: Features.LogicalProperties,
				targets: {
					safari: (16 << 16) | (4 << 8),
				},
				errorRecovery: true,
				...options,
				code: new TextEncoder().encode(rawCss),
			}).code,
		);
	} catch (error) {
		console.error("Lightning CSS error:", error);

		return rawCss;
	}
}
