import type { FormData } from "@quickcv/shared-schema";

interface CoolestTemplateProps {
	data: FormData;
}

export default function CoolestTemplate({ data }: CoolestTemplateProps) {
	return (
		<div className="bg-white dark:bg-gray-950 text-black dark:text-white p-4 transition-colors">
			<pre className="text-sm font-mono">{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}

export const name = "coolest";
