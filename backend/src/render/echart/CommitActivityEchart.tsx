import type { EChartsOption } from "echarts";
import type { GithubCommitActivity } from "../../types/contribution";

const colors = {
    page: "#f4f6f1",
    surface: "#ffffff",
    text: "#111827",
    mutedText: "#9ca3af",
    axis: "#d1d5db",
    grid: "#eef0eb",
    accent: "#4183c4",
};

const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    }).format(date);
};

const metric = (left: number, label: string, value: string) => ({
    type: "group" as const,
    left,
    top: 58,
    children: [
        {
            type: "text" as const,
            style: {
                text: label,
                fill: colors.mutedText,
                font: "600 10px Arial, sans-serif",
            },
        },
        {
            type: "text" as const,
            top: 18,
            style: {
                text: value,
                fill: colors.text,
                font: "600 16px Arial, sans-serif",
            },
        },
    ],
});

export const chart = (
    commitActivity: GithubCommitActivity,
    from: string,
    to: string,
    width: number,
    height: number,
): EChartsOption => {
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
    const peakDay = peak.index >= 0 ? dates[peak.index] : undefined;
    const dateRange = `${formatDate(from)} - ${formatDate(to)}`;
    const cardInset = Math.min(24, Math.max(10, Math.round(Math.min(width, height) * 0.055)));
    const cardWidth = Math.max(0, width - (cardInset * 2));
    const cardHeight = Math.max(0, height - (cardInset * 2));
    const headerLeft = cardInset + 30;
    const metricWidth = 104;
    const metricsLeft = Math.max(headerLeft + 260, width - cardInset - (metricWidth * 3) - 30);
    const xAxisInterval = Math.max(0, Math.ceil(dates.length / 6) - 1);

    return {
        animation: false,
        backgroundColor: colors.page,
        graphic: [
            {
                type: "rect",
                shape: { x: cardInset, y: cardInset, width: cardWidth, height: cardHeight, r: 28 },
                style: { fill: colors.surface },
            },
            {
                type: "text",
                left: headerLeft,
                top: 54,
                style: { text: "DAILY VOLUME", fill: colors.mutedText, font: "600 11px Arial, sans-serif" },
            },
            {
                type: "text",
                left: headerLeft,
                top: 76,
                style: { text: "All commits by date", fill: colors.text, font: "600 21px Arial, sans-serif" },
            },
            {
                type: "text",
                left: headerLeft,
                top: 108,
                style: {
                    text: "A complete daily count combined from every tracked repository.",
                    fill: "#6b7280",
                    font: "400 12px Arial, sans-serif",
                },
            },
            {
                type: "text",
                left: headerLeft,
                top: 135,
                style: { text: `PERIOD  ${dateRange}`, fill: colors.mutedText, font: "600 10px Arial, sans-serif" },
            },
            metric(metricsLeft, "TOTAL COMMITS", String(commitActivity.total)),
            metric(metricsLeft + metricWidth, "PEAK COMMITS", String(peak.count)),
            metric(metricsLeft + (metricWidth * 2), "PEAK DAY", formatDate(peakDay)),
        ],
        grid: {
            top: 184,
            right: cardInset + 30,
            bottom: cardInset + 34,
            left: cardInset + 36,
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: dates,
            axisLine: { lineStyle: { color: colors.axis } },
            axisTick: { show: false },
            axisLabel: {
                color: colors.mutedText,
                fontSize: 11,
                margin: 13,
                interval: xAxisInterval,
                hideOverlap: true,
                formatter: formatDate,
            },
        },
        yAxis: {
            type: "value",
            min: 0,
            minInterval: 1,
            splitNumber: 4,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: colors.mutedText, fontSize: 11 },
            splitLine: { lineStyle: { color: colors.grid } },
        },
        series: [{
            name: "Commits",
            type: "bar",
            barMaxWidth: 26,
            data: commitCounts,
            itemStyle: { color: colors.accent, borderRadius: [7, 7, 0, 0] },
            emphasis: { disabled: true },
        }],
    };
};
