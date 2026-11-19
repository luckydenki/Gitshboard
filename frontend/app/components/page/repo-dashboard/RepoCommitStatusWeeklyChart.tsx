import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import type { CommitStatusWeek } from "~/types/response/repo-commit-status";
import { formatCommitNumber, formatCommitWeek } from "~/utils/page/repo-commit-status";

type Props = { points: CommitStatusWeek[]; timezone: string };

/** 완료된 최근 1년의 주별 기본 브랜치 커밋 수를 보여줍니다. */
export default function RepoCommitStatusWeeklyChart({ points, timezone }: Props) {
    const labels = points.map(({ from }) => formatCommitWeek(from, timezone));
    const option: EChartsOption = {
        animation: false,
        grid: { left: 44, right: 16, top: 20, bottom: 34 },
        xAxis: { type: "category", data: labels, axisLabel: { interval: Math.max(0, Math.floor(points.length / 6) - 1) } },
        yAxis: { type: "value", min: 0, minInterval: 1 },
        tooltip: { trigger: "axis", formatter: (params) => {
            const item = Array.isArray(params) ? params[0] : params;
            const point = points[item?.dataIndex ?? 0];
            return point ? `${formatCommitWeek(point.from, timezone)} 주<br/>${formatCommitNumber(point.count)}개 커밋` : "";
        } },
        series: [{ type: "line", data: points.map(({ count }) => count), smooth: false,
            showSymbol: points.length < 15, lineStyle: { color: "#6b7280", width: 3 },
            itemStyle: { color: "#6b7280" } }],
    };
    return <EChartsReact option={option} opts={{ renderer: "svg" }} className="h-64 w-full min-w-0" />;
}
