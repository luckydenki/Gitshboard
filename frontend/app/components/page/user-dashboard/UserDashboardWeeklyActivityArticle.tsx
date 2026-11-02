import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { activitySummaryMock as summary, weeklyActivityMock as weeklyActivity } from "~/mock/home-dashboard/dashboard-activity";

const weeklyOption: EChartsOption = {
    animation: false,
    aria: { enabled: true },
    color: ["#076BFF", "#6B7280", "#D1D5DB"],
    tooltip: { trigger: "axis", confine: true, extraCssText: "box-shadow: none;" },
    legend: {
        bottom: 0,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: "#6B7280", fontSize: 11 },
    },
    grid: { top: 16, right: 8, bottom: 48, left: 30 },
    xAxis: {
        type: "category",
        data: weeklyActivity.map(({ day }) => day),
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#D1D5DB" } },
        axisLabel: { color: "#6B7280" },
    },
    yAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: { color: "#6B7280", fontSize: 11 },
        splitLine: { lineStyle: { color: "#E5E7EB", type: "dashed" } },
    },
    series: [
        { name: "커밋", type: "bar", stack: "activity", barMaxWidth: 20, data: weeklyActivity.map(({ commits }) => commits) },
        { name: "PR", type: "bar", stack: "activity", data: weeklyActivity.map(({ pullRequests }) => pullRequests) },
        { name: "이슈", type: "bar", stack: "activity", data: weeklyActivity.map(({ issues }) => issues) },
    ],
};

export default function UserDashboardWeeklyActivityArticle() {
    return (
        <article className="bg-panel flex min-h-48 flex-col gap-4 rounded-lg border border-gray-300 p-5">
            <h3 className="font-bold">최근 일주일 간의 활동</h3>
            <p className="text-xs text-gray-500">{summary.weeklyPeriod} · 예시 데이터</p>
            <figure className="min-w-0">
                <EChartsReact option={weeklyOption} opts={{ renderer: "svg" }} style={{ height: 210, width: "100%" }} />
                <figcaption className="sr-only">
                    요일별 커밋, PR, 이슈 수.
                    {weeklyActivity.map(({ day, commits, pullRequests, issues }) => `${day}요일: 커밋 ${commits}건, PR ${pullRequests}건, 이슈 ${issues}건.`).join(" ")}
                </figcaption>
            </figure>
        </article>
    );
}


