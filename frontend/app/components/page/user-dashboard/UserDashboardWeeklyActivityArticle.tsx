import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import type { UserCommitActivity } from "~/hooks/useUserDashboard";

export default function UserDashboardWeeklyActivityArticle({
    data,
    isLoading,
    isError,
    weekStart,
}: {
    data?: UserCommitActivity;
    isLoading: boolean;
    isError: boolean;
    weekStart: string;
}) {
    const days = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(`${weekStart}T00:00:00Z`);
        date.setUTCDate(date.getUTCDate() + index);
        const key = date.toISOString().slice(0, 10);
        const count =
            data?.commitOccuredAt.reduce(
                (sum, value, i) => sum + (value === key ? (data.commitCounts[i] ?? 0) : 0),
                0,
            ) ?? 0;
        return { date: key, count };
    });
    const option: EChartsOption = {
        animation: false,
        aria: { enabled: true },
        color: ["#076BFF"],
        tooltip: { trigger: "axis", confine: true },
        grid: { top: 16, right: 8, bottom: 32, left: 30 },
        xAxis: {
            type: "category",
            data: days.map(({ date }) => date.slice(5)),
            axisTick: { show: false },
        },
        yAxis: { type: "value", minInterval: 1 },
        series: [
            { name: "커밋", type: "bar", barMaxWidth: 20, data: days.map(({ count }) => count) },
        ],
    };
    return (
        <article className="bg-panel flex min-h-48 flex-col gap-4 rounded-lg border border-gray-300 p-5">
            <h3 className="font-bold">최근 일주일 간의 활동</h3>
            <p className="text-xs text-gray-500">커밋 기여 · UTC 기준 · PR과 이슈는 준비 중</p>
            {isLoading && <p role="status">커밋 활동을 불러오는 중입니다.</p>}
            {isError && <p role="alert">커밋 활동을 불러오지 못했습니다.</p>}
            {data && (
                <figure className="min-w-0">
                    <EChartsReact
                        option={option}
                        opts={{ renderer: "svg" }}
                        style={{ height: 210, width: "100%" }}
                    />
                    <figcaption className="sr-only">
                        {days.map(({ date, count }) => `${date}: 커밋 ${count}건`).join(", ")}
                    </figcaption>
                </figure>
            )}
        </article>
    );
}
