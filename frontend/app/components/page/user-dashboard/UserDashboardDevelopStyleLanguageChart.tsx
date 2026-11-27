import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { languageUsageMock } from "~/mock/home-dashboard/dashboard-develop-style";

export default function UserDashboardDevelopStyleLanguageChart({
    languages = languageUsageMock,
    otherPercentage = 4,
}: {
    languages?: { language: string; percentage: number; color: string }[];
    otherPercentage?: number;
}) {
    const option: EChartsOption = {
        animation: false,
        aria: {
            enabled: true,
            description: "언어별 코드 구성 비율 가로 막대그래프",
        },
        grid: { left: 90, right: 40, top: 12, bottom: 28 },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            valueFormatter: (value) => `${value}%`,
        },
        xAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { formatter: "{value}%", color: "#6b7280" },
            splitLine: { lineStyle: { color: "#d1d5db" } },
        },
        yAxis: {
            type: "category",
            inverse: true,
            data: languages.map(({ language }) => language),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: "#6b7280" },
        },
        series: [
            {
                type: "bar",
                name: "코드 구성 비율",
                barMaxWidth: 16,
                label: { show: true, position: "right", formatter: "{c}%", color: "#6b7280" },
                data: languages.map(({ percentage, color }) => ({
                    value: percentage,
                    itemStyle: { color, borderRadius: [0, 4, 4, 0] },
                })),
            },
        ],
    };
    return (
        <div className="min-w-0">
            <EChartsReact
                option={option}
                opts={{ renderer: "svg" }}
                style={{ height: 208, width: "100%" }}
            />
            <p className="text-xs text-gray-500">
                코드 구성 비율 · 전체 언어 기준 · 기타 {otherPercentage}%
            </p>
        </div>
    );
}
