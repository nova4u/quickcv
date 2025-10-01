import { describe, expect, it } from "vitest";
import compileTailwind from "../compile-tailwind";

const minifiedCompileTailwind = (classes: string[]) =>
	compileTailwind(classes, { minify: true });

describe("compileTailwind", () => {
	it("should compile basic Tailwind utility classes to CSS with Lightning CSS processing", async () => {
		const classes = ["flex", "items-center", "justify-center"];
		const result = await minifiedCompileTailwind(classes);

		expect(result).toBeDefined();
		expect(typeof result).toBe("string");
		expect(result).toContain("display:flex"); // minified output
		expect(result).toContain("align-items:center");
		expect(result).toContain("justify-content:center");
	});

	it("should compile responsive Tailwind classes and flatten nested media queries", async () => {
		const classes = ["md:flex"];
		const result = await minifiedCompileTailwind(classes);

		expect(result).toBeDefined();
		expect(typeof result).toBe("string");
		expect(result).toContain("display:flex");

		expect(result).toMatch(/@media.*48rem.*\.md\\:flex.*display:flex/s);
	});

	it("should handle multiple responsive classes", async () => {
		const classes = ["md:flex", "lg:grid", "sm:block"];
		const result = await minifiedCompileTailwind(classes);

		expect(result).toBeDefined();
		expect(typeof result).toBe("string");
		expect(result).toContain("display:flex");
		expect(result).toContain("display:grid");
		expect(result).toContain("display:block");

		// Should contain multiple media queries
		const mediaQueries = result.match(/@media/g);
		expect(mediaQueries).toBeTruthy();
		expect(mediaQueries?.length).toBeGreaterThan(0);
	});

	it("should minify CSS output", async () => {
		const classes = ["p-4", "m-2", "bg-blue-500"];
		const result = await minifiedCompileTailwind(classes);

		expect(result).toBeDefined();
		// Minified CSS should not contain extra whitespace
		expect(result).not.toMatch(/\n\s+/);
		expect(result).not.toMatch(/;\s+/);
	});
});
