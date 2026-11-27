import type { GetRepoPullRequestStatsData } from "~/types/response/repo-pr-issue";
import { formatCount, formatPercent } from "~/utils/page/repo-project-status";
import RepoPrIssueDuration from "./RepoPrIssueDuration";

import RepoDashboardPullRequestStatsPanels1 from "./RepoDashboardPullRequestStatsPanels1";
import RepoDashboardPullRequestStatsPanels2 from "./RepoDashboardPullRequestStatsPanels2";

import { RepoPrIssueMetricRetry, RepoPrIssueMetricSkeleton } from "./RepoPrIssueMetricArticle";

type Props = {
    data?: GetRepoPullRequestStatsData;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
};
function useView({ data }: Props) {
    const totals = data?.totals.value;
    const overview = data?.overview.value;
    const size = data?.sizeStats.value;
    const collaboration = data?.collaboration.value;
    const outcome = overview?.outcomes;
    const merged = outcome?.mergedPercent ?? null;
    const unmerged = merged === null ? null : 100 - merged;
    const pullRequestTotals = [
        { label: "열린 PR", value: formatCount(totals?.open), detail: "현재 열림" },
        { label: "병합된 PR", value: formatCount(totals?.merged), detail: "전체 기간" },
        {
            label: "병합 없이 닫힌 PR",
            value: formatCount(totals?.closedUnmerged),
            detail: "전체 기간",
        },
    ];
    const firstReviewTime = (
        <RepoPrIssueDuration seconds={data?.firstReview.value?.medianSeconds ?? null} />
    );
    const mergeTime = <RepoPrIssueDuration seconds={overview?.mergeTime.medianSeconds ?? null} />;
    const prTimeline = [
        { label: "생성", value: "시작" },
        { label: "첫 리뷰", value: firstReviewTime },
        { label: "병합", value: mergeTime },
    ];
    const prReviewMetrics = [
        { term: "평균 리뷰", value: collaboration?.meanReviews?.toFixed(1) ?? "—" },
        { term: "평균 댓글", value: collaboration?.meanComments?.toFixed(1) ?? "—" },
        { term: "평균 참여자", value: collaboration?.meanParticipants?.toFixed(1) ?? "—" },
    ];
    const prSizes = (size?.sizes ?? []).map((x) => ({ ...x, percent: x.percent?.toFixed(1) ?? 0 }));
    const prMetrics = [
        {
            label: "Draft PR 비율",
            value: formatPercent(data?.draft.value?.percent ?? null),
            detail: "현재 열린 PR 기준",
        },
        { label: "변경 요청 후 수정", value: "—", detail: "집계 미제공" },
        { label: "승인 없이 병합", value: "—", detail: "집계 미제공" },
        { label: "코드와 테스트 동시 변경", value: "—", detail: "집계 미제공" },
        { label: "코드와 문서 동시 변경", value: "—", detail: "집계 미제공" },
        { label: "외부 기여자 PR 병합률", value: "—", detail: "집계 미제공" },
        {
            label: "봇 PR 비율",
            value: formatPercent(overview?.bots.percent ?? null),
            detail: "작성자 유형을 확인한 최근 PR",
        },
        { label: "Dependabot PR 비율", value: "—", detail: "집계 미제공" },
    ];
    const mergeMethods = ["Merge commit", "Squash merge", "Rebase merge"].map((term) => ({
        term,
        value: "집계 미제공",
    }));
    const barWidths = [
        "0%",
        "0%",
        "0%",
        "0%",
        (merged ?? 0) + "%",
        (unmerged ?? 0) + "%",
        "0%",
        "0%",
        "0%",
    ];
    const summary = {
        decidedPrPeriod: "최근 28일에 생성된 PR",
        prOutcomeDistribution:
            "병합 " + formatPercent(merged) + ", 병합 없이 종료 " + formatPercent(unmerged),
        mergedRate: formatPercent(merged),
        closedPrRate: formatPercent(unmerged),
        firstReviewTime,
        mergeTime,
        longestPrTime: <RepoPrIssueDuration seconds={overview?.mergeTime.p90Seconds ?? null} />,
        changedFiles: "평균 변경 파일 " + formatCount(size?.meanChangedFiles),
        smallPrMergeTime: (
            <RepoPrIssueDuration
                seconds={size?.mergeTimeBySize[0]?.duration.medianSeconds ?? null}
            />
        ),
        largePrMergeTime: (
            <RepoPrIssueDuration
                seconds={size?.mergeTimeBySize[2]?.duration.medianSeconds ?? null}
            />
        ),
        linkedIssues: formatCount(data?.linkedIssues.value?.linkedPrs),
        linkedPrs: formatCount(data?.linkedIssues.value?.referencedIssues),
        mergeMethodDistribution: "집계 미제공",
    };
    return {
        pullRequestTotals,
        firstReviewTime,
        mergeTime,
        prTimeline,
        prReviewMetrics,
        prSizes,
        prMetrics,
        mergeMethods,
        barWidths,
        summary,
    };
}
export type View = ReturnType<typeof useView>;
export default function RepoDashboardPullRequestStatsSection(props: Props) {
    const view = useView(props);
    const { pullRequestTotals } = view;
    const partial = [
        props.data?.totals,
        props.data?.draft,
        props.data?.overview,
        props.data?.firstReview,
        props.data?.sizeStats,
        props.data?.collaboration,
        props.data?.linkedIssues,
    ].flatMap((metric) => (metric?.status === "partial" ? [metric.reason] : []))[0];
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
            aria-label="Pull Request 통계"
            className="flex flex-col gap-6 border-gray-300 pt-6">
            {notice}
            <div className="flex flex-wrap gap-4">
                {pullRequestTotals.map((item) => (
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
                <RepoDashboardPullRequestStatsPanels1 {...view} />
                <RepoDashboardPullRequestStatsPanels2 {...view} />
            </div>
        </section>
    );
}
