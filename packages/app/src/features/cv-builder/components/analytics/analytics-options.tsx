import { FormItem } from "@/components/form/form-item";
import { ANALYTICS_OPTIONS } from "../../constants/analytics-constants";

export function AnalyticsOptions() {
	return (
		<FormItem
			name="analytics.type"
			type="radio"
			options={ANALYTICS_OPTIONS}
			showLabel={false}
		/>
	);
}