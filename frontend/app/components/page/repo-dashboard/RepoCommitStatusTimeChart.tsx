import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { formatCommitNumber } from "~/utils/page/repo-commit-status";

type Props = { buckets: { startHour: number; count: number }[] };

/** 최근 완료된 90일의 4시간대별 커밋 수를 보여줍니다. */
export default function RepoCommitStatusTimeChart({ buckets }: Props) {
    const option: EChartsOption = {
        animation: false,
        grid: { left: 38, right: 12, top: 18, bottom: 30 },
        xAxis: {
            type: "category",
            data: buckets.map(({ startHour }) => `${String(startHour).padStart(2, "0")}시`),
        },
        yAxis: { type: "value", min: 0, minInterval: 1 },
        tooltip: {
            trigger: "axis",
            valueFormatter: (value) => `${formatCommitNumber(Number(value))}개`,
        },
        series: [
            {
                type: "bar",
                data: buckets.map(({ count }) => count),
                itemStyle: { color: "#9ca3af", borderRadius: [6, 6, 0, 0] },
                barMaxWidth: 38,
            },
        ],
    };
    return (
        <EChartsReact
            option={option}
            opts={{ renderer: "svg" }}
            className="h-52 w-full min-w-0"
        />
    );
}
