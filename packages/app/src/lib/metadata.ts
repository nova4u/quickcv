import { config } from "@/config/app";

export interface PageMetadata {
	service: string;
	serviceDisplayName: string;
	version: string;
	created: string;
	formData: {
		projectName: string;
		title: string;
		content: string;
	};
	template: string;
	lastModified: string;
}

/**
 * Extract metadata from HTML content
 */
export function extractMetadataFromHTML(html: string): PageMetadata | null {
	try {
		// Look for our metadata script
		const regex = new RegExp(
			`<script[^>]*id="${config.metadataScriptId}"[^>]*>([\\s\\S]*?)<\\/script>`,
			"i",
		);

		const match = html.match(regex);
		if (!match || !match[1]) {
			return null;
		}

		// Parse the JSON content
		const jsonContent = match[1].trim();
		const metadata: PageMetadata = JSON.parse(jsonContent);

		// Validate that it's our service
		if (metadata.service !== config.serviceName) {
			return null;
		}

		return metadata;
	} catch (error) {
		console.error("Failed to extract metadata:", error);
		return null;
	}
}

/**
 * Check if a project name was created by our service
 */
export function isOurProject(projectName: string): boolean {
	return projectName.startsWith(config.projectPrefix);
}

/**
 * Remove prefix from project name to get the original user input
 */
export function removeProjectPrefix(projectName: string): string {
	if (projectName.startsWith(config.projectPrefix)) {
		return projectName.slice(config.projectPrefix.length);
	}
	return projectName;
}

/**
 * Fetch and extract metadata from a deployed page
 */
export async function fetchPageMetadata(
	url: string,
): Promise<PageMetadata | null> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}

		const html = await response.text();
		return extractMetadataFromHTML(html);
	} catch (error) {
		console.error("Failed to fetch page metadata:", error);
		return null;
	}
}

/**
 * List projects that belong to our service from Vercel API
 */
export async function listOurProjects(token: string): Promise<
	Array<{
		id: string;
		name: string;
		displayName: string; // Without prefix
	}>
> {
	const response = await fetch("https://api.vercel.com/v9/projects", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		// Include response status in error for better error handling
		const error = new Error("Failed to fetch projects");
		(error as any).status = response.status;
		throw error;
	}

	const data = await response.json();

	// Filter projects that belong to our service
	return data.projects
		.filter((project: any) => isOurProject(project.name))
		.map((project: any) => ({
			id: project.id,
			name: project.name,
			displayName: removeProjectPrefix(project.name),
		}));
}
