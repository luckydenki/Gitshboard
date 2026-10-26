import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";

export default function DashboardContributionCalendarArticle() {
    const ThemeColors = {
        green: {
            heatMapRange: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        },
    };
    const heatMapColorRange = ThemeColors.green.heatMapRange;

    const option: EChartsOption = {
        visualMap: {
            min: 0,
            max: 10,
            show: false,
            inRange: {
                color: heatMapColorRange,
            },
        },

        calendar: {
            range: "2026",
            splitLine: {
                show: false,
            },
            yearLabel: {
                show: false,
            },
            left: "80px",
            right: "80px",
        },

        series: {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: [
                ["2026-01-01", 3],
                ["2026-01-02", 7],
                ["2026-01-03", 15],
                ["2026-01-04", 10],
                ["2026-10-06", 8],
                // ...
            ],
            emphasis: {
                itemStyle: {
                    borderWidth: 2,
                    borderColor: "#fff",
                },
            },
        },

        tooltip: {
            trigger: "item",
            formatter: (params) => {
                if (Array.isArray(params)) return "";

                const [date, count] = params.value as [string, number];

                return `${date}<br/><b>${count}</b> contributions`;
            },
        },
        media: [
            {
                query: {
                    maxWidth: 700,
                },
                option: {
                    calendar: {
                        left: 30,
                    },
                },
            },
        ],
    };

    return (
        <article className="flex h-fit w-full flex-col gap-2">
            <div className="w-full overflow-x-auto">
                <EChartsReact
                    option={option}
                    className="w-full min-w-5xl"
                />
            </div>
        </article>
    );
}
