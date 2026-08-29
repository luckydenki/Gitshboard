import * as echarts from "echarts";
import type { GithubCommitActivity } from "../types/contribution";

const colors = {
    background: "#0d1117",
    border: "#30363d",
    text: "#f0f6fc",
    mutedText: "#8b949e",
    grid: "#21262d",
    accentLight: "#58a6ff",
};

const formatDate = (date?: string) => date ? date.replace(/-/g, ".") : "No activity";

const metricCard = (left: number, label: string, value: string) => ({
    type: "group" as const,
    left,
    top: 24,
    children: [
        {
            type: "rect" as const,
            shape: { width: 108, height: 62, r: 8 },
            style: { fill: "#161b22", stroke: colors.border, lineWidth: 1 },
        },
        {
            type: "text" as const,
            left: 12,
            top: 11,
            style: {
                text: label,
                fill: colors.mutedText,
                font: "500 11px Arial, sans-serif",
            },
        },
        {
            type: "text" as const,
            left: 12,
            top: 30,
            style: {
                text: value,
                fill: colors.text,
                font: "600 17px Arial, sans-serif",
            },
        },
    ],
});

export function RenderCommitActivitySVG(commitActivity: GithubCommitActivity, from: string, to: string, width: number, height: number): string {
    // Keep the x-axis and series aligned even if an upstream response is incomplete.
    


    const dataLength = Math.min(
        commitActivity.commitOccuredAt.length,
        commitActivity.commitCounts.length,
    );
    const dates = commitActivity.commitOccuredAt.slice(0, dataLength);
    const commitCounts = commitActivity.commitCounts.slice(0, dataLength);

    const peak = commitCounts.reduce(
        (currentPeak, count, index) => count > currentPeak.count
            ? { count, index }
            : currentPeak,
        { count: 0, index: -1 },
    );
    const maxCommitCount = peak.count;
    const maxCommitDay = peak.index >= 0 ? dates[peak.index] : undefined;
    //console.log("maxCommitCount:", maxCommitCount, "maxCommitDay:", maxCommitDay);
    const dateRange = `${from.split("T")[0]} - ${to.split("T")[0]}`

    //console.log("dateRange:", dateRange, "dates : ", dates);

        // ? `${formatDate(dates[0])} — ${formatDate(dates[dates.length - 1])}`
        // : "No contribution activity available";
    const xAxisInterval = Math.max(0, Math.ceil(dates.length / 6) - 1);

    const chart = echarts.init(null, null, {
        renderer: "svg",
        ssr: true,
        width,
        height,
    });

    chart.setOption({
        animation: true,
        backgroundColor: colors.background,
        graphic: [
            {
                type: "text",
                left: 32,
                top: 25,
                style: {
                    text: "Commit activity",
                    fill: colors.text,
                    font: "600 22px Arial, sans-serif",
                },
            },
            {
                type: "text",
                left: 32,
                top: 57,
                style: {
                    text: dateRange,
                    fill: colors.mutedText,
                    font: "400 13px Arial, sans-serif",
                },
            },
            metricCard(546, "TOTAL COMMITS", String(commitActivity.total)),
            metricCard(664, "PEAK COMMITS", String(maxCommitCount)),
            metricCard(782, "PEAK DAY", formatDate(maxCommitDay)),
        ],
        grid: {
            left: 58,
            right: 32,
            top: 122,
            bottom: 50,
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: dates,
            axisLine: { lineStyle: { color: colors.border } },
            axisTick: { show: false },
            axisLabel: {
                color: colors.mutedText,
                fontSize: 11,
                margin: 14,
                interval: xAxisInterval,
                formatter: (value: string) => value.slice(5).replace("-", "."),
            },
        },
        yAxis: {
            type: "value",
            min: 0,
            minInterval: 1,
            splitNumber: 4,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: colors.mutedText,
                fontSize: 11,
                margin: 12,
            },
            splitLine: { lineStyle: { color: colors.grid, type: "dashed" } },
        },
        series: [
            {
                name: "Commits",
                type: "line",
                data: commitCounts,
                smooth: true,
                showSymbol: false,
                lineStyle: { color: colors.accentLight, width: 3 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(47, 129, 247, 0.42)" },
                        { offset: 1, color: "rgba(47, 129, 247, 0.02)" },
                    ]),
                },
                emphasis: { disabled: true },
                markPoint: maxCommitDay ? {
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: { color: colors.accentLight, borderColor: colors.background, borderWidth: 3 },
                    label: {
                        show: true,
                        position: "top",
                        color: colors.text,
                        fontSize: 11,
                        fontWeight: 600,
                        formatter: `${maxCommitCount} commits`,
                    },
                    data: [{ coord: [peak.index, maxCommitCount], value: maxCommitCount }],
                } : undefined,
            },
        ],
    });

    const svg = chart.renderToSVGString();
    chart.dispose();

    return svg;
}
