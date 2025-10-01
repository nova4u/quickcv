import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateTotalYears, formatDate, formatDateRange } from "./date-utils";

describe("formatDate", () => {
	it("should format valid date strings correctly", () => {
		expect(formatDate("2023-03")).toBe("Mar 2023");
		expect(formatDate("2023-01")).toBe("Jan 2023");
		expect(formatDate("2023-12")).toBe("Dec 2023");
		expect(formatDate("2020-06")).toBe("Jun 2020");
	});

	it("should handle edge cases", () => {
		expect(formatDate("")).toBe("");
		expect(formatDate(null)).toBe("");
		expect(formatDate(undefined)).toBe("");
	});

	it("should return original string for invalid formats", () => {
		expect(formatDate("invalid")).toBe("invalid");
		expect(formatDate("2023")).toBe("2023");
		expect(formatDate("2023-13")).toBe("2023-13"); // Invalid month
		expect(formatDate("2023-00")).toBe("2023-00"); // Invalid month
	});

	it("should handle all months correctly", () => {
		const months = [
			{ input: "2023-01", expected: "Jan 2023" },
			{ input: "2023-02", expected: "Feb 2023" },
			{ input: "2023-03", expected: "Mar 2023" },
			{ input: "2023-04", expected: "Apr 2023" },
			{ input: "2023-05", expected: "May 2023" },
			{ input: "2023-06", expected: "Jun 2023" },
			{ input: "2023-07", expected: "Jul 2023" },
			{ input: "2023-08", expected: "Aug 2023" },
			{ input: "2023-09", expected: "Sep 2023" },
			{ input: "2023-10", expected: "Oct 2023" },
			{ input: "2023-11", expected: "Nov 2023" },
			{ input: "2023-12", expected: "Dec 2023" },
		];

		months.forEach(({ input, expected }) => {
			expect(formatDate(input)).toBe(expected);
		});
	});
});

describe("formatDateRange", () => {
	it("should format current positions correctly", () => {
		const dates = {
			current: true,
			startDate: "2023-03",
		};
		expect(formatDateRange(dates)).toBe("Mar 2023 - Now");
	});

	it("should format completed positions correctly", () => {
		const dates = {
			current: false,
			startDate: "2020-01",
			endDate: "2023-06",
		};
		expect(formatDateRange(dates)).toBe("Jan 2020 - Jun 2023");
	});

	it("should handle missing end date for non-current positions", () => {
		const dates = {
			current: false,
			startDate: "2020-01",
		};
		expect(formatDateRange(dates)).toBe("Jan 2020 - ");
	});

	it("should handle invalid dates gracefully", () => {
		const dates = {
			current: false,
			startDate: "invalid",
			endDate: "also-invalid",
		};
		expect(formatDateRange(dates)).toBe("invalid - also-invalid");
	});
});

describe("calculateTotalYears", () => {
	// Mock Date.now() to ensure consistent test results
	const mockDate = new Date("2024-12-15T00:00:00.000Z");

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(mockDate);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should calculate years correctly for single current position", () => {
		// Jan 2019 to Dec 2024 = 5 years 11 months (should be 5+ years)
		const dateRanges = [
			{
				current: true,
				startDate: "2019-01",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("5+ years");
	});

	it("should calculate years correctly for completed positions", () => {
		// Jan 2020 to Jan 2022 = exactly 2 years
		const dateRanges = [
			{
				current: false,
				startDate: "2020-01",
				endDate: "2022-01",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("2 years");
	});

	it("should calculate years with remaining months", () => {
		// Jan 2020 to Apr 2022 = 2 years 3 months
		const dateRanges = [
			{
				current: false,
				startDate: "2020-01",
				endDate: "2022-04",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("2+ years");
	});

	it("should handle less than one year", () => {
		// Jan 2023 to Nov 2023 = 10 months
		const dateRanges = [
			{
				current: false,
				startDate: "2023-01",
				endDate: "2023-11",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("< 1 year");
	});

	it("should handle exactly one year", () => {
		// Jan 2022 to Jan 2023 = exactly 1 year
		const dateRanges = [
			{
				current: false,
				startDate: "2022-01",
				endDate: "2023-01",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("1 year");
	});

	it("should handle one year with extra months", () => {
		// Jan 2022 to Mar 2023 = 1 year 2 months
		const dateRanges = [
			{
				current: false,
				startDate: "2022-01",
				endDate: "2023-03",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("1+ years");
	});

	it("should handle multiple date ranges", () => {
		// First job: Jan 2018 to Dec 2019 = 1 year 11 months
		// Second job: Jan 2020 to Dec 2021 = 2 years
		// Total: 3 years 11 months = 3+ years
		const dateRanges = [
			{
				current: false,
				startDate: "2018-01",
				endDate: "2019-12",
			},
			{
				current: false,
				startDate: "2020-01",
				endDate: "2021-12",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("3+ years");
	});

	it("should handle multiple ranges with current position", () => {
		// Past job: Jan 2020 to Dec 2021 = 2 years
		// Current job: Jan 2022 to now (Dec 2024) = 2 years 11 months
		// Total: 4 years 11 months = 4+ years
		const dateRanges = [
			{
				current: false,
				startDate: "2020-01",
				endDate: "2021-12",
			},
			{
				current: true,
				startDate: "2022-01",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("4+ years");
	});

	it("should skip entries without end date and not current", () => {
		const dateRanges = [
			{
				current: false,
				startDate: "2020-01",
				endDate: "2022-01",
			},
			{
				current: false,
				startDate: "2023-01",
				// No endDate and not current - should be skipped
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("2 years");
	});

	it("should handle empty array", () => {
		expect(calculateTotalYears([])).toBe("< 1 year");
	});

	it("should handle zero months correctly", () => {
		// Same month start and end
		const dateRanges = [
			{
				current: false,
				startDate: "2023-01",
				endDate: "2023-01",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("< 1 year");
	});

	it("should handle exact year boundaries", () => {
		// Test various exact year scenarios
		const testCases = [
			{
				range: [{ current: false, startDate: "2020-01", endDate: "2023-01" }],
				expected: "3 years",
			},
			{
				range: [{ current: false, startDate: "2020-01", endDate: "2024-01" }],
				expected: "4 years",
			},
			{
				range: [{ current: false, startDate: "2020-01", endDate: "2025-01" }],
				expected: "5 years",
			},
		];

		testCases.forEach(({ range, expected }) => {
			expect(calculateTotalYears(range)).toBe(expected);
		});
	});

	it("should handle overlapping date ranges correctly", () => {
		const dateRanges = [
			{
				current: false,
				startDate: "2020-01",
				endDate: "2022-03",
			},
			{
				current: false,
				startDate: "2021-03",
				endDate: "2022-03",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("2+ years");
	});

	it("should handle non-overlapping date ranges", () => {
		const dateRanges = [
			{
				current: false,
				startDate: "2019-01",
				endDate: "2020-01",
			},
			{
				current: true,
				startDate: "2020-02",
			},
		];
		expect(calculateTotalYears(dateRanges)).toBe("5+ years");
	});

	it("should handle complex overlapping scenarios", () => {
		const dateRanges = [
			{
				current: false,
				startDate: "2020-01",
				endDate: "2021-06",
			},
			{
				current: false,
				startDate: "2021-03",
				endDate: "2022-12",
			},
			{
				current: false,
				startDate: "2022-06",
				endDate: "2023-01",
			},
		];

		expect(calculateTotalYears(dateRanges)).toBe("3 years");
	});
});
