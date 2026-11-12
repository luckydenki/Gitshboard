import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";

interface UserDashboardContributionCalendarArticleProps {
    weeks: Array<{
        contributionDays: Array<{ date: string; contributionCount: number }>;
    }>;
}

export default function UserDashboardContributionCalendarArticle({
    weeks,
}: UserDashboardContributionCalendarArticleProps) {
    const ThemeColors = {
        green: {
            heatMapRange: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        },
    };
    const heatMapColorRange = ThemeColors.green.heatMapRange;
    const days = weeks.flatMap((week) => week.contributionDays);
    const firstDate = days[0]?.date;
    const lastDate = days[days.length - 1]?.date;

    if (!firstDate || !lastDate) {
        return <article className="text-sm text-gray-500">표시할 기여 내역이 없습니다.</article>;
    }

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
            range: [firstDate, lastDate],
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
            data: days.map((day) => [day.date, day.contributionCount]),
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
