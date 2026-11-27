import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import type { IssueFlow } from "~/types/response/repo-pr-issue";
import { formatCommitWeek } from "~/utils/page/repo-commit-status";

type Props = { weeks: IssueFlow["weeks"]; timezone: string };
export default function RepoIssueFlowChart({ weeks, timezone }: Props) {
    const issueFlow = weeks.map((point) => ({
        ...point,
        week: formatCommitWeek(point.from, timezone),
    }));
    const issueFlowOption: EChartsOption = {
        color: ["#6B7280", "#9CA3AF"],
        tooltip: { trigger: "axis" },
        legend: {
            bottom: 0,
            data: ["신규", "종료"],
            textStyle: { color: "#6B7280" },
        },
        grid: { left: 32, right: 12, top: 20, bottom: 48, containLabel: true },
        xAxis: {
            type: "category",
            data: issueFlow.map(({ week }) => week),
            axisLabel: { color: "#6B7280" },
            axisLine: { lineStyle: { color: "#D1D5DB" } },
        },
        yAxis: {
            type: "value",
            min: 0,
            axisLabel: { color: "#6B7280" },
            splitLine: { lineStyle: { color: "#E5E7EB" } },
        },
        series: [
            {
                name: "신규",
                type: "bar",
                data: issueFlow.map(({ opened }) => opened),
                barMaxWidth: 30,
            },
            {
                name: "종료",
                type: "bar",
                data: issueFlow.map(({ closed }) => closed),
                barMaxWidth: 30,
            },
        ],
    };

    return (
        <EChartsReact
            option={issueFlowOption}
            style={{ height: 260, width: "100%" }}
        />
    );
}
