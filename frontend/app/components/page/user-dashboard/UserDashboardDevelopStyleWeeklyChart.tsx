import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { weeklyActivityMock } from "~/mock/home-dashboard/dashboard-develop-style";

export default function UserDashboardDevelopStyleWeeklyChart() {
    const option: EChartsOption = {
        animation: false,
        aria: {
            enabled: true,
            description: "예시 데이터로 표시한 월요일부터 일요일까지의 활동 건수 막대그래프",
        },
        grid: { left: 40, right: 18, top: 36, bottom: 36 },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            valueFormatter: (value) => `${value}건`,
        },
        xAxis: {
            type: "category",
            data: weeklyActivityMock.map(({ day }) => day),
            axisLabel: { interval: 0, color: "#6b7280" },
        },
        yAxis: {
            type: "value",
            name: "활동 (건)",
            min: 0,
            minInterval: 1,
            axisLabel: { color: "#6b7280" },
            splitLine: { lineStyle: { color: "#d1d5db" } },
        },
        series: [
            {
                name: "활동",
                type: "bar",
                data: weeklyActivityMock.map(({ count }) => count),
                barMaxWidth: 36,
                itemStyle: { color: "#076BFF", borderRadius: [4, 4, 0, 0] },
            },
        ],
    };
    return (
        <EChartsReact
            option={option}
            opts={{ renderer: "svg" }}
            style={{ height: 280, width: "100%" }}
        />
    );
}
