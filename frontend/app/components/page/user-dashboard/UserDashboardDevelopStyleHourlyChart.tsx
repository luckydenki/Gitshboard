import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { hourlyActivityMock } from "~/mock/home-dashboard/dashboard-develop-style";

export default function UserDashboardDevelopStyleHourlyChart({
    points = hourlyActivityMock,
}: {
    points?: { hour: number; count: number }[];
}) {
    const option: EChartsOption = {
        animation: false,
        aria: {
            enabled: true,
            description: "0시부터 23시까지의 시간대별 활동 건수 선 그래프",
        },
        grid: { left: 40, right: 18, top: 36, bottom: 36 },
        tooltip: { trigger: "axis", valueFormatter: (value) => `${value}건` },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: points.map(({ hour }) => `${hour}시`),
            axisLabel: {
                color: "#6b7280",
                hideOverlap: true,
                showMinLabel: true,
                showMaxLabel: true,
            },
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
                type: "line",
                data: points.map(({ count }) => count),
                itemStyle: { color: "#076BFF" },
                symbolSize: 6,
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
