import type { EChartsOption } from "echarts";
import type { CommitStats } from "../../utils/stat";

const formatHour = (hour: number) => `${hour < 10 ? "0" : ""}${hour}:00`;

export const chart = (commitStats: CommitStats, width: number, height: number): EChartsOption => {
    const cardInset = Math.min(24, Math.max(10, Math.round(Math.min(width, height) * 0.055)));
    const cardWidth = Math.max(0, width - (cardInset * 2));
    const cardHeight = Math.max(0, height - (cardInset * 2));
    const contentLeft = cardInset + 30;
    const strongestTime = commitStats.total > 0 && commitStats.timeBuckets.length > 0
        ? commitStats.timeBuckets.reduce((strongest, current) => current.count > strongest.count ? current : strongest)
        : undefined;
    const strongestTitle = strongestTime ? `${strongestTime.label} focus` : "No commit data";
    const strongestDetail = strongestTime
        ? `Peak activity is around ${formatHour(commitStats.peakHour)} in your local timezone.`
        : "Commit time analysis will appear after data is available.";
    const summaryHeight = Math.min(104, Math.max(76, Math.round(height * 0.22)));
    const summaryTop = height - cardInset - summaryHeight - 24;

    return {
        animation: false,
        backgroundColor: "#f4f6f1",
        graphic: [
            {
                type: "rect",
                z: -1,
                shape: { x: cardInset, y: cardInset, width: cardWidth, height: cardHeight, r: 28 },
                style: { fill: "#ffffff" },
            },
            {
                type: "text",
                z: 10,
                left: contentLeft,
                top: 54,
                style: { text: "WORK PATTERN", fill: "#9ca3af", font: "600 11px Arial, sans-serif" },
            },
            {
                type: "text",
                z: 10,
                left: contentLeft,
                top: 76,
                style: { text: "Preferred commit time", fill: "#111827", font: "600 21px Arial, sans-serif" },
            },
            {
                type: "text",
                z: 10,
                left: contentLeft,
                top: 108,
                style: { text: "Activity by time of day", fill: "#6b7280", font: "400 12px Arial, sans-serif" },
            },
            {
                type: "rect",
                z: 10,
                shape: { x: contentLeft, y: summaryTop, width: Math.max(0, cardWidth - 60), height: summaryHeight, r: 18 },
                style: { fill: "#eef4ff" },
            },
            {
                type: "text",
                z: 11,
                left: contentLeft + 20,
                top: summaryTop + 17,
                style: { text: "STRONGEST WINDOW", fill: "#9ca3af", font: "600 10px Arial, sans-serif" },
            },
            {
                type: "text",
                z: 11,
                left: contentLeft + 20,
                top: summaryTop + 37,
                style: { text: strongestTitle, fill: "#111827", font: "600 16px Arial, sans-serif" },
            },
            {
                type: "text",
                z: 11,
                left: contentLeft + 20,
                top: summaryTop + 62,
                style: { text: strongestDetail, fill: "#6b7280", font: "400 12px Arial, sans-serif" },
            },
            ...(commitStats.timeBuckets.length === 0 ? [{
                type: "text" as const,
                z: 10,
                left: "center" as const,
                top: "47%" as const,
                style: {
                    text: "No commit history available",
                    fill: "#6b7280",
                    font: "400 14px Arial, sans-serif",
                    align: "center" as const,
                },
            }] : []),
        ],
        grid: {
            top: 150,
            right: cardInset + 70,
            bottom: height - summaryTop + 14,
            left: contentLeft + 66,
        },
        xAxis: { type: "value", min: 0, max: 100, show: false },
        yAxis: {
            type: "category",
            inverse: true,
            data: commitStats.timeBuckets.map(({ label }) => label),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: "#6b7280", fontSize: 12, margin: 14 },
        },
        series: commitStats.timeBuckets.length ? [{
            type: "bar",
            data: commitStats.timeBuckets.map(({ percent }) => percent),
            barWidth: 12,
            showBackground: true,
            backgroundStyle: { color: "#f3f4f6", borderRadius: 6 },
            itemStyle: { color: "#111827", borderRadius: 6 },
            label: {
                show: true,
                position: "right",
                distance: 12,
                color: "#9ca3af",
                fontSize: 11,
                fontWeight: 600,
                formatter: "{c}%",
            },
            emphasis: { disabled: true },
        }] : [],
    };
};
