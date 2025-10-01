import type { AnalyticsData, FormData } from "@quickcv/shared-schema";
import { renderToString } from "react-dom/server";
import extractTailwindClasses from "./extract-tailwind-classes";
import templates, { type TemplateType } from "./templates.gen";

export interface RenderOptions {
	data: FormData;
	templateKey?: TemplateType;
	includeStyles?: boolean;
	analytics?: AnalyticsData;
}

function generateAnalyticsScripts(analytics?: AnalyticsData): string {
	if (!analytics || analytics.type === "none") {
		return "";
	}

	const scripts: string[] = [];

	// Umami
	if (analytics.type === "umami" && analytics.umamiWebsiteId) {
		scripts.push(`
			<script defer src="https://cloud.umami.is/script.js" data-website-id="${analytics.umamiWebsiteId}"></script>
		`);
	}

	// Google Analytics
	if (analytics.type === "google" && analytics.googleTrackingId) {
		scripts.push(`
			<script async src="https://www.googletagmanager.com/gtag/js?id=${analytics.googleTrackingId}"></script>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${analytics.googleTrackingId}');
			</script>
		`);
	}

	// Vercel Analytics
	if (analytics.type === "vercel") {
		scripts.push(`
			<script>
				window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
			</script>
			<script defer src="/_vercel/insights/script.js"></script>
		`);
	}

	return scripts.join("\n");
}

export async function renderTemplateToHTML(
	options: RenderOptions,
): Promise<string> {
	const { data, templateKey = "minimal" } = options;
	const TemplateComponent = templates[templateKey].component;

	const componentHTML = renderToString(<TemplateComponent data={data} />);
	const classes = extractTailwindClasses(componentHTML);
	const { default: compileTailwind } = await import(
		"@quickcv/templates/compile-tailwind"
	);
	const css = await compileTailwind(classes, {
		minify: true,
		darkMode: false,
	});

	const analyticsScripts = generateAnalyticsScripts(data.analytics);

	const html = `
	<!DOCTYPE html>
	<html lang="en" data-theme="${templateKey}">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="generator" content="QuickCV 1.0">
		<title>${data.generalInfo.fullName} - Portfolio</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link rel="preload" href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
		<link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">
		<style>${css}</style>${analyticsScripts ? `\n\t\t${analyticsScripts}` : ""}
	</head>
	<body class="transition-colors">
		${componentHTML}
	</body>
	</html>
  `.trim();

	return html;
}
