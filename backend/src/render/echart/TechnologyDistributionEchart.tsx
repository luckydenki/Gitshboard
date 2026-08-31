import type { EChartsOption } from "echarts";
import type { LanguageStat } from "../../utils/stat";
import { locale } from "../locale/TechnologyDistributionLocale";
import type { RenderLocale } from "../locale/RenderLocale";

const chartColorByClass: Record<string, string> = {
    "bg-[#3178c6]": "#3178c6",
    "bg-[#e5c743]": "#e5c743",
    "bg-[#4f8f65]": "#4f8f65",
    "bg-[#8b5cf6]": "#8b5cf6",
    "bg-[#dc6b35]": "#dc6b35",
    "bg-[#7952b3]": "#7952b3",
    "bg-[#e34c26]": "#e34c26",
    "bg-gray-400": "#9ca3af",
    "bg-github-light": "#4183c4",
    "bg-blue-500": "#3b82f6",
    "bg-pink-500": "#ec4899",
};

const getChartColor = (color: string) => chartColorByClass[color] ?? "#4183c4";

export const chart = (languageStats: LanguageStat[], width: number, height: number, renderLocale: RenderLocale): EChartsOption => {
    const copy = locale[renderLocale];
    const cardInset = Math.min(24, Math.max(10, Math.round(Math.min(width, height) * 0.055)));
    const cardWidth = Math.max(0, width - (cardInset * 2));
    const cardHeight = Math.max(0, height - (cardInset * 2));
    const contentLeft = cardInset + 30;
    const languages = languageStats.filter(({ size }) => Number.isFinite(size) && size > 0);

    return {
        animation: true,
        backgroundColor: "#f4f6f1",
        color: languages.map(({ color }) => getChartColor(color)),
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
            ...(!languages.length ? [{
                type: "text" as const,
                z: 10,
                left: "center" as const,
                top: "55%" as const,
                style: {
                    text: copy.empty,
                    fill: "#6b7280",
                    font: "400 14px Arial, sans-serif",
                    align: "center" as const,
                },
            }] : []),
        ],
        series: languages.length ? [{
            type: "pie",
            radius: ["30%", "45%"],
            center: ["50%", "58%"],
            avoidLabelOverlap: true,
            itemStyle: { borderColor: "#ffffff", borderWidth: 4, borderRadius: 6 },
            label: {
                show: true,
                position: "outside",
                color: "#374151",
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 14,
                formatter: "{b}\n{d}%",
            },
            labelLine: {
                show: true,
                length: 8,
                length2: 6,
                lineStyle: { color: "#d1d5db", width: 1 },
            },
            emphasis: { disabled: true },
            data: languages.map(({ name, size }) => ({ name, value: size })),
        }] : [],
    };
};
