import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import type { UserCommitActivity } from "~/hooks/useUserDashboard";

export default function UserDashboardRepositoryActivityArticle({ data, isLoading, isError }: {
    data?: UserCommitActivity; isLoading: boolean; isError: boolean;
}) {
    const repositories = (data?.results ?? []).map(({ repositoryName, commitCount }) => ({
        name: repositoryName, count: commitCount.reduce((sum, count) => sum + count, 0),
    })).filter(({ count }) => count > 0).sort((a, b) => b.count - a.count).slice(0, 5);
    const option: EChartsOption = {
        animation: false, aria: { enabled: true },
        tooltip: { trigger: "axis", confine: true },
        grid: { top: 8, right: 30, bottom: 24, left: 114 },
        xAxis: { type: "value", minInterval: 1 },
        yAxis: { type: "category", inverse: true, data: repositories.map(({ name }) => name), axisLabel: { width: 102, overflow: "truncate" } },
        series: [{ name: "커밋", type: "bar", barMaxWidth: 14, label: { show: true, position: "right" }, data: repositories.map(({ count }, index) => ({ value: count, itemStyle: { color: index === 0 ? "#076BFF" : "#9CA3AF" } })) }],
    };
    return (
        <article className="bg-panel flex min-h-48 flex-col gap-4 rounded-lg border border-gray-300 p-5">
            <h3 className="font-bold">저장소 별 활동</h3>
            <p className="text-xs text-gray-500">최근 7일 커밋 기여 상위 5개 · UTC 기준</p>
            {isLoading && <p role="status">저장소 활동을 불러오는 중입니다.</p>}
            {isError && <p role="alert">저장소 활동을 불러오지 못했습니다.</p>}
            {data && (repositories.length ? <figure className="min-w-0">
                <EChartsReact option={option} opts={{ renderer: "svg" }} style={{ height: 210, width: "100%" }} />
                <figcaption className="sr-only">{repositories.map(({ name, count }) => `${name}: ${count}건`).join(", ")}</figcaption>
            </figure> : <p className="text-sm text-gray-500">최근 커밋 활동이 없습니다.</p>)}
        </article>
    );
}
