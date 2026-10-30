import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { repositoryActivityMock as repositoryActivity } from "~/mock/home-dashboard/dashboard-activity";

const repositoryOption: EChartsOption = {
    animation: false,
    aria: { enabled: true },
    tooltip: { trigger: "axis", confine: true, extraCssText: "box-shadow: none;" },
    grid: { top: 8, right: 30, bottom: 24, left: 114 },
    xAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: { color: "#6B7280", fontSize: 11 },
        splitLine: { lineStyle: { color: "#E5E7EB", type: "dashed" } },
    },
    yAxis: {
        type: "category",
        inverse: true,
        data: repositoryActivity.map(({ name }) => name),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: "#6B7280", fontSize: 11, width: 102, overflow: "truncate" },
    },
    series: [{
        name: "활동 수",
        type: "bar",
        barMaxWidth: 14,
        label: { show: true, position: "right", color: "#6B7280", fontSize: 11 },
        data: repositoryActivity.map(({ count }, index) => ({
            value: count,
            itemStyle: { color: index === 0 ? "#076BFF" : "#9CA3AF" },
        })),
    }],
};

export default function DashboardRepositoryActivityArticle() {
    return (
        <article className="bg-panel flex min-h-48 flex-col gap-4 rounded-lg border border-gray-300 p-5">
            <h3 className="font-bold">저장소 별 활동</h3>
            <p className="text-xs text-gray-500">주간 커밋 · PR · 이슈 합계 · 예시 데이터</p>
            <figure className="min-w-0">
                <EChartsReact option={repositoryOption} opts={{ renderer: "svg" }} style={{ height: 210, width: "100%" }} />
                <figcaption className="sr-only">
                    {repositoryActivity.map(({ name, count }) => `${name}: ${count}건`).join(", ")}
                </figcaption>
            </figure>
        </article>
    );
}


