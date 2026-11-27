import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import type { CommitStatusCodeWeek } from "~/types/response/repo-commit-status";
import { formatCommitNumber, formatCommitWeek } from "~/utils/page/repo-commit-status";

type Props = { points: CommitStatusCodeWeek[]; timezone: string };

/** 주별 순 코드 변화량과 각 주의 추가·삭제 줄 수를 보여줍니다. */
export default function RepoCommitStatusCodeChangeChart({ points, timezone }: Props) {
    const option: EChartsOption = {
        animation: false,
        grid: { left: 56, right: 14, top: 16, bottom: 32 },
        xAxis: {
            type: "category",
            data: points.map(({ from }) => formatCommitWeek(from, timezone)),
            axisLabel: { interval: Math.max(0, Math.floor(points.length / 5) - 1) },
        },
        yAxis: { type: "value" },
        tooltip: {
            trigger: "axis",
            formatter: (params) => {
                const item = Array.isArray(params) ? params[0] : params;
                const point = points[item?.dataIndex ?? 0];
                return point
                    ? `${formatCommitWeek(point.from, timezone)} 주<br/>순증감 ${formatCommitNumber(point.net)}줄<br/>추가 ${formatCommitNumber(point.additions)}줄<br/>삭제 ${formatCommitNumber(point.deletions)}줄`
                    : "";
            },
        },
        series: [
            {
                type: "line",
                data: points.map(({ net }) => net),
                showSymbol: false,
                lineStyle: { color: "#6b7280", width: 3 },
                itemStyle: { color: "#6b7280" },
            },
        ],
    };
    return (
        <EChartsReact
            option={option}
            opts={{ renderer: "svg" }}
            className="h-44 w-full min-w-0"
        />
    );
}
