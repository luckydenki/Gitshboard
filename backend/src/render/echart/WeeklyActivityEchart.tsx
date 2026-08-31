import type { EChartsOption } from "echarts";
import type { CommitStats } from "../../utils/stat";
import { locale } from "../locale/WeeklyActivityLocale";
import type { RenderLocale } from "../locale/RenderLocale";

export const chart = (commitStats: CommitStats, width: number, height: number, renderLocale: RenderLocale): EChartsOption => {
    const copy = locale[renderLocale];
    const cardInset = Math.min(24, Math.max(10, Math.round(Math.min(width, height) * 0.055)));
    const cardWidth = Math.max(0, width - (cardInset * 2));
    const cardHeight = Math.max(0, height - (cardInset * 2));
    const contentLeft = cardInset + 30;

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
                style: { text: copy.eyebrow, fill: "#9ca3af", font: "600 11px Arial, sans-serif" },
            },
            {
                type: "text",
                z: 10,
                left: contentLeft,
                top: 76,
                style: { text: copy.title, fill: "#111827", font: "600 21px Arial, sans-serif" },
            },
            {
                type: "text",
                z: 10,
                left: contentLeft,
                top: 108,
                style: { text: copy.detail, fill: "#6b7280", font: "400 12px Arial, sans-serif" },
            },
            ...(commitStats.total === 0 ? [{
                type: "text" as const,
                z: 10,
                left: "center" as const,
                top: "59%" as const,
                style: {
                    text: copy.empty,
                    fill: "#6b7280",
                    font: "400 14px Arial, sans-serif",
                    align: "center" as const,
                },
            }] : []),
        ],
        grid: {
            top: 160,
            right: cardInset + 34,
            bottom: cardInset + 40,
            left: cardInset + 36,
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: commitStats.weekdays.map(({ label }) => copy.weekday[label] ?? label),
            axisTick: { show: false },
            axisLine: { lineStyle: { color: "#e5e7eb" } },
            axisLabel: { color: "#9ca3af", fontSize: 11, fontWeight: 500, margin: 13 },
        },
        yAxis: { type: "value", max: 100, show: false },
        series: commitStats.weekdays.length ? [{
            type: "bar",
            data: commitStats.weekdays.map(({ heightPercent, count }) => ({
                value: heightPercent,
                label: { formatter: String(count) },
            })),
            barMaxWidth: 42,
            itemStyle: {
                color: "#4183c4",
                borderRadius: [10, 10, 3, 3],
                shadowBlur: 14,
                shadowColor: "rgba(65, 131, 196, 0.22)",
            },
            label: {
                show: commitStats.total > 0,
                position: "top",
                distance: 8,
                color: "#6b7280",
                fontSize: 11,
                fontWeight: 600,
            },
            emphasis: { disabled: true },
        }] : [],
    };
};
