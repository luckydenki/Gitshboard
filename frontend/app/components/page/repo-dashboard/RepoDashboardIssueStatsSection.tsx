import type { ReactNode } from "react";
import type { GetRepoIssueStatsData } from "~/types/response/repo-pr-issue";
import { formatCount, formatPercent } from "~/utils/page/repo-project-status";
import RepoPrIssueDuration from "./RepoPrIssueDuration";

import RepoDashboardIssueStatsPanels1 from "./RepoDashboardIssueStatsPanels1";
import RepoDashboardIssueStatsPanels2 from "./RepoDashboardIssueStatsPanels2";

import { RepoPrIssueMetricRetry, RepoPrIssueMetricSkeleton } from "./RepoPrIssueMetricArticle";

type Props = {
    data?: GetRepoIssueStatsData;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    popular?: ReactNode;
};
function useView({ data, popular }: Props) {
    const stats = data?.stats.value;
    const flow = stats?.flow;
    const weeks = flow?.weeks ?? [];
    const timezone = data?.timezone ?? "Asia/Seoul";
    const unavailable = "집계 미제공";
    const totals = stats?.totals;
    const issueTotals = [
        { label: "열린 Issue", value: formatCount(totals?.open), detail: "현재 열림" },
        { label: "닫힌 Issue", value: formatCount(totals?.closed), detail: "전체 기간" },
        { label: "전체 Issue", value: formatCount(totals?.total), detail: "전체 기간" },
    ];
    const issueProcessing = [
        { term: "신규 Issue", value: formatCount(flow?.opened), detail: "최근 28일" },
        { term: "종료 Issue", value: formatCount(flow?.closed), detail: "최근 28일" },
        {
            term: "Issue 처리 비율",
            value: formatPercent(flow?.closeToOpenPercent ?? null),
            detail: "종료 ÷ 신규",
        },
        { term: "순증감", value: formatCount(flow?.net), detail: "신규 − 종료" },
    ];
    const issueAge = (stats?.openAge ?? []).map((x) => ({
        ...x,
        percent: x.percent?.toFixed(1) ?? 0,
    }));
    const issueLabels = (stats?.labels ?? []).map((x) => ({ ...x, percent: x.percent ?? 0 }));
    const issueTypes = (stats?.closeDurationByType ?? []).map((x) => ({
        label: x.type ?? "미지정",
        median: <RepoPrIssueDuration seconds={x.duration.medianSeconds} />,
        width:
            (100 * (x.duration.medianSeconds ?? 0)) /
                Math.max(
                    1,
                    ...(stats?.closeDurationByType ?? []).map(
                        (item) => item.duration.medianSeconds ?? 0,
                    ),
                ) +
            "%",
    }));
    const milestones = (data?.milestones.value ?? []).map((x) => ({
        name: x.title,
        total: x.open + x.closed,
        closed: x.closed,
        percent: x.percent ?? 0,
    }));
    const issueAssignments = [
        {
            term: "담당자 없음",
            value: formatCount(stats?.participation.unassigned),
            detail: "열린 Issue 기준",
        },
        {
            term: "good first issue",
            value: formatCount(stats?.participation.goodFirstIssue),
            detail: "열린 Issue 기준",
        },
    ];
    const issueCommentDistribution = (stats?.commentDistribution ?? []).map((x) => ({
        label: x.label,
        value: formatPercent(x.percent),
        width: (x.percent ?? 0) + "%",
    }));
    const issueCloseReasons = (stats?.closeReasons ?? []).map((x) => ({
        term: x.label,
        value: formatPercent(x.percent),
    }));
    const barWidths = (stats?.closeReasons ?? []).map((x) => (x.percent ?? 0) + "%");
    const summary = {
        issuePeriod: "최근 28일 · 오늘 제외",
        openedIssues: formatCount(flow?.opened),
        closedIssues: formatCount(flow?.closed),
        issueCloseTime: (
            <RepoPrIssueDuration seconds={stats?.closeDuration.medianSeconds ?? null} />
        ),
        oldestIssue: <RepoPrIssueDuration seconds={stats?.closeDuration.p90Seconds ?? null} />,
        issueCloseDistribution: issueCloseReasons.map((x) => x.term + " " + x.value).join(", "),
    };
    return {
        weeks,
        timezone,
        unavailable,
        issueTotals,
        issueProcessing,
        issueAge,
        issueLabels,
        issueTypes,
        milestones,
        issueAssignments,
        issueCommentDistribution,
        issueCloseReasons,
        barWidths,
        summary,
        popular,
    };
}
export type View = ReturnType<typeof useView>;
export default function RepoDashboardIssueStatsSection(props: Props) {
    const view = useView(props);
    const { issueTotals } = view;
    const partial = [props.data?.stats, props.data?.milestones].flatMap((metric) =>
        metric?.status === "partial" ? [metric.reason] : [],
    )[0];
    const notice = props.loading ? (
        <RepoPrIssueMetricSkeleton />
    ) : props.error || partial ? (
        <RepoPrIssueMetricRetry
            message={props.error ?? partial ?? "모든 데이터를 수집하지 못했습니다."}
            onRetry={props.onRetry}
        />
    ) : null;
    return (
        <section
            aria-label="Issue 통계"
            className="flex flex-col gap-6">
            {notice}
            <div className="flex flex-wrap gap-4">
                {issueTotals.map((item) => (
                    <article
                        key={item.label}
                        className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333333%-0.666667rem)]">
                        <h3 className="text-sm text-gray-500">{item.label}</h3>
                        <strong className="block text-3xl">{item.value}</strong>
                        <p className="text-xs text-gray-500">{item.detail}</p>
                    </article>
                ))}
            </div>

            <div className="flex flex-wrap gap-6">
                <RepoDashboardIssueStatsPanels1 {...view} />
                <RepoDashboardIssueStatsPanels2 {...view} />
            </div>
        </section>
    );
}
