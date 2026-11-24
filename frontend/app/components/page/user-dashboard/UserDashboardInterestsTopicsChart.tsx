import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { interestTopicsMock } from "~/mock/home-dashboard/dashboard-interests";
export default function UserDashboardInterestsTopicsChart() {
    const option: EChartsOption = {
        animation: false,
        aria: {
            enabled: true,
            description:
                "예시 주제별 조회 횟수: 프론트엔드 12회, 개발자 도구 8회, 데이터 시각화 5회",
        },
        grid: { left: 100, right: 38, top: 12, bottom: 26 },
        tooltip: { trigger: "axis", valueFormatter: (value) => `${value}회` },
        xAxis: {
            type: "value",
            min: 0,
            minInterval: 1,
            axisLabel: { color: "#6b7280" },
            splitLine: { lineStyle: { color: "#d1d5db" } },
        },
        yAxis: {
            type: "category",
            inverse: true,
            data: interestTopicsMock.map((topic) => topic.name),
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { color: "#6b7280" },
        },
        series: [
            {
                type: "bar",
                data: interestTopicsMock.map((topic) => topic.count),
                barMaxWidth: 16,
                itemStyle: { color: "#076BFF", borderRadius: [0, 4, 4, 0] },
                label: { show: true, position: "right", formatter: "{c}회", color: "#6b7280" },
            },
        ],
    };
    return (
        <EChartsReact
            option={option}
            opts={{ renderer: "svg" }}
            style={{ height: 200, width: "100%" }}
        />
    );
}
