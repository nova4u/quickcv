import type { AnalyticsData } from "@quickcv/shared-schema";
import GoogleIcon from "@/assets/google.svg?react";
import UmamiIcon from "@/assets/umami.svg?react";
import VercelIcon from "@/assets/vercel.svg?react";

interface ProjectMetaProps {
	template?: string;
	analyticsType?: AnalyticsData["type"];
	className?: string;
}

interface AnalyticsIconProps {
	type: ProjectMetaProps["analyticsType"];
}

const ANALYTICS_CONFIG = {
	google: {
		label: "Google Analytics",
		icon: GoogleIcon,
		ariaLabel: "Google Analytics icon",
	},
	umami: {
		label: "Umami",
		icon: UmamiIcon,
		ariaLabel: "Umami Analytics icon",
	},
	vercel: {
		label: "Vercel",
		icon: VercelIcon,
		ariaLabel: "Vercel Analytics icon",
	},
} as const;

const ICON_CLASSES = "w-4 h-4" as const;

const formatTemplateName = (template?: string): string | null => {
	if (!template) return null;
	return template.charAt(0).toUpperCase() + template.slice(1);
};

const getAnalyticsConfig = (type?: AnalyticsData["type"]) => {
	if (!type || type === "none") return null;
	return ANALYTICS_CONFIG[type] || ANALYTICS_CONFIG.vercel;
};

function AnalyticsIcon({ type }: AnalyticsIconProps) {
	const config = getAnalyticsConfig(type);
	if (!config) return null;

	const IconComponent = config.icon;
	return (
		<IconComponent
			className={ICON_CLASSES}
			aria-label={config.ariaLabel}
			role="img"
		/>
	);
}

export function ProjectMeta({
	template,
	analyticsType,
	className,
}: ProjectMetaProps) {
	const templateName = formatTemplateName(template);
	const analyticsConfig = getAnalyticsConfig(analyticsType);

	if (!templateName && !analyticsConfig) return null;

	return (
		<div className={className}>
			<div className="flex items-center gap-2 flex-wrap text-sm text-neutral-600 leading-tight tracking-tight">
				{templateName ? <span>Template: {templateName}</span> : null}

				{analyticsConfig ? (
					<>
						<span className="text-xs text-black/50" aria-hidden="true">
							•
						</span>
						<div className="flex items-center gap-1.5">
							<span>Analytics:</span>
							<AnalyticsIcon type={analyticsType} />
							<span>{analyticsConfig.label}</span>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default ProjectMeta;
