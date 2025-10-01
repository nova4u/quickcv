import { describe, expect, it } from "vitest";
import extractTailwindClasses from "../extract-tailwind-classes";

describe("extractTailwindClasses", () => {
	it("should extract simple classes from HTML", () => {
		const html = '<div class="flex items-center">Test</div>';
		const result = extractTailwindClasses(html);

		expect(result).toContain("flex");
		expect(result).toContain("items-center");
		expect(result).toHaveLength(2);
	});

	it("should handle multiple elements with different classes", () => {
		const html = `
			<div class="bg-blue-500 text-white p-4">
				<span class="font-bold text-lg">Title</span>
				<p class="mt-2 opacity-80">Description</p>
			</div>
		`;
		const result = extractTailwindClasses(html);

		expect(result).toContain("bg-blue-500");
		expect(result).toContain("text-white");
		expect(result).toContain("p-4");
		expect(result).toContain("font-bold");
		expect(result).toContain("text-lg");
		expect(result).toContain("mt-2");
		expect(result).toContain("opacity-80");
		expect(result).toHaveLength(7);
	});

	it("should deduplicate classes", () => {
		const html = `
			<div class="flex items-center">
				<span class="flex text-center">One</span>
				<span class="flex text-center">Two</span>
			</div>
		`;
		const result = extractTailwindClasses(html);

		// Should have unique classes only
		const flexCount = result.filter((cls) => cls === "flex").length;
		const textCenterCount = result.filter(
			(cls) => cls === "text-center",
		).length;

		expect(flexCount).toBe(1);
		expect(textCenterCount).toBe(1);
		expect(result).toContain("flex");
		expect(result).toContain("items-center");
		expect(result).toContain("text-center");
		expect(result).toHaveLength(3);
	});

	it("should handle empty class attributes", () => {
		const html = '<div class="">Test</div>';
		const result = extractTailwindClasses(html);

		expect(result).toHaveLength(0);
	});

	it("should handle elements without class attributes", () => {
		const html = "<div>Test</div><p>Another element</p>";
		const result = extractTailwindClasses(html);

		expect(result).toHaveLength(0);
	});

	it("should handle complex class names with special characters", () => {
		const html =
			'<div class="sm:flex md:grid-cols-2 lg:w-1/2 xl:bg-gray-100/50">Test</div>';
		const result = extractTailwindClasses(html);

		expect(result).toContain("sm:flex");
		expect(result).toContain("md:grid-cols-2");
		expect(result).toContain("lg:w-1/2");
		expect(result).toContain("xl:bg-gray-100/50");
		expect(result).toHaveLength(4);
	});

	it("should handle classes with multiple spaces and newlines", () => {
		const html = `<div class="flex    items-center
			justify-between
			p-4   bg-white">Test</div>`;
		const result = extractTailwindClasses(html);

		expect(result).toContain("flex");
		expect(result).toContain("items-center");
		expect(result).toContain("justify-between");
		expect(result).toContain("p-4");
		expect(result).toContain("bg-white");
		expect(result).toHaveLength(5);
	});

	it("should handle nested HTML with various class combinations", () => {
		const html = `
			<article class="max-w-4xl mx-auto">
				<header class="mb-8">
					<h1 class="text-3xl font-bold text-gray-900 mb-4">Title</h1>
					<time class="text-sm text-gray-500">2024-01-01</time>
				</header>
				<main class="prose prose-lg">
					<p class="text-base leading-relaxed">Content here</p>
				</main>
			</article>
		`;
		const result = extractTailwindClasses(html);

		expect(result).toContain("max-w-4xl");
		expect(result).toContain("mx-auto");
		expect(result).toContain("mb-8");
		expect(result).toContain("text-3xl");
		expect(result).toContain("font-bold");
		expect(result).toContain("text-gray-900");
		expect(result).toContain("mb-4");
		expect(result).toContain("text-sm");
		expect(result).toContain("text-gray-500");
		expect(result).toContain("prose");
		expect(result).toContain("prose-lg");
		expect(result).toContain("text-base");
		expect(result).toContain("leading-relaxed");
		expect(result).toHaveLength(13);
	});

	it("should return empty array for HTML without class attributes", () => {
		const html = "<div><p>No classes here</p><span>Or here</span></div>";
		const result = extractTailwindClasses(html);

		expect(result).toEqual([]);
	});

	it("should handle self-closing tags with classes", () => {
		const html =
			'<img src="test.jpg" class="w-full h-auto rounded-lg" alt="test" />';
		const result = extractTailwindClasses(html);

		expect(result).toContain("w-full");
		expect(result).toContain("h-auto");
		expect(result).toContain("rounded-lg");
		expect(result).toHaveLength(3);
	});

	it("should handle malformed HTML gracefully", () => {
		const html =
			'<div class="flex items-center"<span class="text-red-500">Test</div>';
		const result = extractTailwindClasses(html);

		expect(result).toContain("flex");
		expect(result).toContain("items-center");
		expect(result).toContain("text-red-500");
		expect(result).toHaveLength(3);
	});
});
