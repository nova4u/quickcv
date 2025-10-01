const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

/**
 * Formats a date string from "YYYY-MM" format to "MMM YYYY" format
 * @param dateString Date string in "YYYY-MM" format
 * @returns Formatted date string like "Mar 2023"
 */
export function formatDate(dateString: string | undefined | null): string {
	if (!dateString) return "";

	const [year, month] = dateString.split("-");
	if (!year || !month) return dateString;

	const monthIndex = Number.parseInt(month, 10) - 1;
	if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11)
		return dateString;

	return `${MONTH_NAMES[monthIndex]} ${year}`;
}

/**
 * Formats a date range from date objects to "MMM YYYY - MMM YYYY" or "MMM YYYY - Now" format
 * @param dates Object containing current flag, start date, and optional end date
 * @returns Formatted date range string like "Mar 2021 - Jun 2022" or "Mar 2023 - Now"
 */
export function formatDateRange(dates: {
	current: boolean;
	startDate: string;
	endDate?: string;
}): string {
	const start = formatDate(dates.startDate);
	if (dates.current) {
		return `${start} - Now`;
	}
	const end = formatDate(dates.endDate || "");
	return `${start} - ${end}`;
}

/**
 * Calculates the total years from an array of date ranges by merging overlapping periods
 * @param dateRanges Array of date range objects
 * @returns Formatted string like "4+ years" or "2 years"
 */
export function calculateTotalYears(
	dateRanges: Array<{
		current: boolean;
		startDate: string;
		endDate?: string;
	}>,
): string {
	if (dateRanges.length === 0) {
		return "< 1 year";
	}

	// Convert date ranges to intervals with actual dates
	const intervals: Array<{ start: Date; end: Date }> = [];

	for (const dates of dateRanges) {
		const startDate = new Date(`${dates.startDate}-01`);
		let endDate: Date;

		if (dates.current) {
			endDate = new Date();
		} else if (dates.endDate) {
			endDate = new Date(`${dates.endDate}-01`);
		} else {
			continue; // Skip if no end date and not current
		}

		intervals.push({ start: startDate, end: endDate });
	}

	if (intervals.length === 0) {
		return "< 1 year";
	}

	// Sort intervals by start date
	intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

	// Merge overlapping intervals
	const merged: Array<{ start: Date; end: Date }> = [intervals[0]];

	for (let i = 1; i < intervals.length; i++) {
		const current = intervals[i];
		const lastMerged = merged[merged.length - 1];

		// If current interval overlaps with the last merged interval, merge them
		if (current.start <= lastMerged.end) {
			lastMerged.end = new Date(
				Math.max(lastMerged.end.getTime(), current.end.getTime()),
			);
		} else {
			// No overlap, add as new interval
			merged.push(current);
		}
	}

	// Calculate total months from merged intervals
	let totalMonths = 0;
	for (const interval of merged) {
		const monthsDiff =
			(interval.end.getFullYear() - interval.start.getFullYear()) * 12 +
			(interval.end.getMonth() - interval.start.getMonth());
		totalMonths += Math.max(0, monthsDiff);
	}

	const totalYears = Math.floor(totalMonths / 12);
	const remainingMonths = totalMonths % 12;

	if (totalYears === 0) {
		return "< 1 year";
	}
	if (totalYears === 1) {
		return remainingMonths > 0 ? "1+ years" : "1 year";
	}

	// For 2+ years, only add "+" if there are remaining months
	return remainingMonths > 0 ? `${totalYears}+ years` : `${totalYears} years`;
}
