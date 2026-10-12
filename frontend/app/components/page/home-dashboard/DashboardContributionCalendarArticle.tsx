import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";

interface DashboardContributionCalendarArticleProps {
    option: EChartsOption;
}

export default function DashboardContributionCalendarArticle({
    option,
}: DashboardContributionCalendarArticleProps) {
    return (
        <article className="flex h-fit w-full flex-col gap-2">
            <div className="w-full overflow-x-auto">
                <EChartsReact
                    option={option}
                    className="w-full min-w-5xl"
                />
            </div>
        </article>
    );
}
