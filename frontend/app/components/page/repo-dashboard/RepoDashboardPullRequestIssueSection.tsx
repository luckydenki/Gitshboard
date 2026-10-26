import {
    barWidthsMock,
    issueFlowMock as issueFlow,
    issueAgeMock as issueAge,
    issueLabelsMock as issueLabels,
    issueTypesMock as issueTypes,
    milestonesMock as milestones,
    prSizesMock as prSizes,
    prMetricsMock as prMetrics,
    issueTotalsMock as issueTotals,
    issueProcessingMock as issueProcessing,
    issueAssignmentsMock as issueAssignments,
    issueCommentDistributionMock as issueCommentDistribution,
    popularIssuesMock as popularIssues,
    issueCloseReasonsMock as issueCloseReasons,
    pullRequestTotalsMock as pullRequestTotals,
    prTimelineMock as prTimeline,
    prReviewMetricsMock as prReviewMetrics,
    mergeMethodsMock as mergeMethods,
    summaryMock,
} from "~/mock/repo-dashboard/pull-request-issue";
import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";

const issueFlowOption: EChartsOption = {
    color: ["#076BFF", "#9CA3AF"],
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

export default function RepoDashboardPullRequestIssueSection() {
    return (
        <section
            aria-label="PR 및 이슈 현황"
            className="flex min-w-0 flex-col gap-6">
            <section
                aria-label="Issue 통계"
                className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {issueTotals.map((item) => (
                        <article
                            key={item.label}
                            className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                            <h3 className="text-sm text-gray-500">{item.label}</h3>
                            <strong className="mt-3 block text-3xl">{item.value}</strong>
                            <p className="mt-2 text-xs text-gray-500">{item.detail}</p>
                        </article>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold">Issue 신규·종료 추이</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {summaryMock.issuePeriod}
                                </p>
                            </div>
                            <div className="flex gap-5 text-sm">
                                <span>
                                    <strong className="text-primary">
                                        {summaryMock.openedIssues}
                                    </strong>{" "}
                                    신규
                                </span>
                                <span>
                                    <strong>{summaryMock.closedIssues}</strong> 종료
                                </span>
                            </div>
                        </div>
                        <EChartsReact
                            option={issueFlowOption}
                            style={{ height: 260, width: "100%" }}
                        />
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">처리 흐름</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {issueProcessing.map((item) => (
                                <div
                                    key={item.term}
                                    className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <dt className="text-sm font-medium">{item.term}</dt>
                                        <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                                    </div>
                                    <dd className="text-primary text-lg font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">첫 응답까지</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Issue 등록부터 첫 유지관리자 응답
                        </p>
                        <dl className="mt-6 flex gap-5">
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">중앙값</dt>
                                <dd className="mt-2 text-xl font-bold">
                                    {summaryMock.firstResponseTime}
                                </dd>
                            </div>
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">90백분위</dt>
                                <dd className="mt-2 text-xl font-bold">
                                    {summaryMock.assigneeTime}
                                </dd>
                            </div>
                        </dl>
                    </article>
                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">종료까지</h3>
                        <p className="mt-1 text-sm text-gray-500">Issue 등록부터 종료</p>
                        <dl className="mt-6 flex gap-5">
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">중앙값</dt>
                                <dd className="mt-2 text-xl font-bold">
                                    {summaryMock.issueCloseTime}
                                </dd>
                            </div>
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">90백분위</dt>
                                <dd className="mt-2 text-xl font-bold">
                                    {summaryMock.oldestIssue}
                                </dd>
                            </div>
                        </dl>
                    </article>
                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">장기 대기와 재오픈</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            <div className="flex items-center justify-between gap-3 py-3 first:pt-0">
                                <dt className="text-sm text-gray-500">30일 이상 활동 없음</dt>
                                <dd className="text-xl font-bold">
                                    {summaryMock.inactiveIssueCount}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
                                <dt className="text-sm text-gray-500">재오픈 비율</dt>
                                <dd className="text-xl font-bold">{summaryMock.reopenedRate}</dd>
                            </div>
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">열린 Issue 경과일</h3>
                        <ul className="mt-5 flex flex-col gap-4">
                            {issueAge.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-gray-500">
                                            {item.count}건 · {item.percent}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{
                                                width: `${item.percent}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">라벨별 Issue</h3>
                        <p className="mt-1 text-xs text-gray-500">열린 Issue의 대표 라벨 기준</p>
                        <ul className="mt-5 flex flex-col gap-4">
                            {issueLabels.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-gray-500">{item.count}건</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{
                                                width: `${item.percent}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">유형별 해결 속도</h3>
                        <p className="mt-1 text-xs text-gray-500">종료까지 걸린 시간의 중앙값</p>
                        <ul className="mt-5 flex flex-col gap-4">
                            {issueTypes.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="font-semibold">{item.median}</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: item.width }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">마일스톤 진행률</h3>
                        <ul className="mt-5 flex flex-col gap-5">
                            {milestones.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.name}</span>
                                        <span className="text-gray-500">
                                            {item.closed}/{item.total}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{
                                                width: `${item.percent}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">참여 가능한 Issue</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {issueAssignments.map((item) => (
                                <div
                                    key={item.term}
                                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <div>
                                        <dt className="text-sm font-medium">{item.term}</dt>
                                        <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                                    </div>
                                    <dd className="text-lg font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">댓글 수 분포</h3>
                        <p className="mt-1 text-xs text-gray-500">Issue당 댓글</p>
                        <ul className="mt-5 flex flex-col gap-3">
                            {issueCommentDistribution.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{item.label}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: item.width }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">토론이 활발한 Issue</h3>
                        <ol className="mt-5 flex flex-col divide-y divide-gray-300">
                            {popularIssues.map((item) => (
                                <li
                                    key={item.number}
                                    className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <span className="min-w-0 text-sm font-medium break-words">
                                        {item.title}
                                        <span className="ml-2 text-xs text-gray-500">
                                            {item.number}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-xs text-gray-500">
                                        댓글 {item.comments}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <h3 className="text-lg font-bold">Issue 종료 사유</h3>
                        <p className="mt-1 text-xs text-gray-500">최근 종료된 Issue의 분류</p>
                        <div
                            className="mt-5 flex h-4 overflow-hidden rounded-lg bg-gray-200"
                            aria-label={summaryMock.issueCloseDistribution}>
                            <span
                                className="bg-primary"
                                style={{ width: barWidthsMock[0] }}
                            />
                            <span
                                className="bg-primary/70"
                                style={{ width: barWidthsMock[1] }}
                            />
                            <span
                                className="bg-primary/40"
                                style={{ width: barWidthsMock[2] }}
                            />
                            <span
                                className="bg-gray-300"
                                style={{ width: barWidthsMock[3] }}
                            />
                        </div>
                        <dl className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {issueCloseReasons.map((item) => (
                                <div key={item.term}>
                                    <dt className="text-xs text-gray-500">{item.term}</dt>
                                    <dd className="mt-1 font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>
                </div>
            </section>

            <section
                aria-label="Pull Request 통계"
                className="flex flex-col gap-6 border-t-1 border-gray-300 pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {pullRequestTotals.map((item) => (
                        <article
                            key={item.label}
                            className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                            <h3 className="text-sm text-gray-500">{item.label}</h3>
                            <strong className="mt-3 block text-3xl">{item.value}</strong>
                            <p className="mt-2 text-xs text-gray-500">{item.detail}</p>
                        </article>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">PR 처리 결과</h3>
                        <p className="mt-1 text-xs text-gray-500">{summaryMock.decidedPrPeriod}</p>
                        <div
                            className="mt-6 flex h-4 overflow-hidden rounded-lg bg-gray-200"
                            aria-label={summaryMock.prOutcomeDistribution}>
                            <span
                                className="bg-primary"
                                style={{ width: barWidthsMock[4] }}
                            />
                            <span
                                className="bg-gray-400"
                                style={{ width: barWidthsMock[5] }}
                            />
                        </div>
                        <dl className="mt-5 flex justify-between gap-4">
                            <div>
                                <dt className="text-xs text-gray-500">병합률</dt>
                                <dd className="mt-1 text-xl font-bold">{summaryMock.mergedRate}</dd>
                            </div>
                            <div className="text-right">
                                <dt className="text-xs text-gray-500">거절·중단</dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {summaryMock.closedPrRate}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">첫 리뷰까지</h3>
                        <p className="mt-1 text-sm text-gray-500">PR 생성부터 첫 리뷰</p>
                        <strong className="mt-6 block text-2xl">
                            {summaryMock.firstReviewTime}
                        </strong>
                        <p className="mt-2 text-xs text-gray-500">중앙값</p>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">병합까지</h3>
                        <p className="mt-1 text-sm text-gray-500">PR 생성부터 병합</p>
                        <dl className="mt-6 flex gap-5">
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">중앙값</dt>
                                <dd className="mt-2 text-xl font-bold">{summaryMock.mergeTime}</dd>
                            </div>
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">90백분위</dt>
                                <dd className="mt-2 text-xl font-bold">
                                    {summaryMock.longestPrTime}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <h3 className="text-lg font-bold">PR 생성 후 리뷰·병합 흐름</h3>
                        <p className="mt-1 text-sm text-gray-500">중앙값 기준 누적 소요 시간</p>
                        <ol className="mt-6 flex items-stretch gap-3 not-sm:flex-col">
                            {prTimeline.map((item, index) => (
                                <li
                                    key={item.label}
                                    className="bg-primary/10 flex min-w-0 flex-1 flex-col gap-2 rounded-lg p-4">
                                    <span className="text-primary text-xs">0{index + 1}</span>
                                    <span className="text-sm font-semibold">{item.label}</span>
                                    <strong>{item.value}</strong>
                                </li>
                            ))}
                        </ol>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">PR당 협업 규모</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {prReviewMetrics.map((item) => (
                                <div
                                    key={item.term}
                                    className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <dt className="text-sm text-gray-500">{item.term}</dt>
                                    <dd className="text-sm font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold">PR 크기 분포</h3>
                                <p className="mt-1 text-sm text-gray-500">변경한 코드 줄 수 기준</p>
                            </div>
                            <span className="text-sm font-semibold">
                                {summaryMock.changedFiles}
                            </span>
                        </div>
                        <ul className="mt-6 flex flex-col gap-4">
                            {prSizes.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-gray-500">
                                            {item.count}건 · {item.percent}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{
                                                width: `${item.percent}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">크기별 병합 속도</h3>
                        <p className="mt-1 text-xs text-gray-500">생성부터 병합까지 중앙값</p>
                        <dl className="mt-6 flex flex-col gap-5">
                            <div>
                                <dt className="text-sm text-gray-500">작은 PR · 100줄 이하</dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {summaryMock.smallPrMergeTime}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">큰 PR · 501줄 이상</dt>
                                <dd className="mt-1 text-xl font-bold">
                                    {summaryMock.largePrMergeTime}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <div className="grid min-w-0 grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
                        {prMetrics.map((item) => (
                            <article
                                key={item.label}
                                className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                                <h3 className="text-sm text-gray-500">{item.label}</h3>
                                <strong className="mt-3 block text-xl">{item.value}</strong>
                                <p className="mt-2 text-xs leading-5 text-gray-500">
                                    {item.detail}
                                </p>
                            </article>
                        ))}
                    </div>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">병합 방식</h3>
                        <p className="mt-1 text-xs text-gray-500">병합된 PR 기준</p>
                        <div
                            className="mt-5 flex h-4 overflow-hidden rounded-lg bg-gray-200"
                            aria-label={summaryMock.mergeMethodDistribution}>
                            <span
                                className="bg-primary"
                                style={{ width: barWidthsMock[6] }}
                            />
                            <span
                                className="bg-primary/60"
                                style={{ width: barWidthsMock[7] }}
                            />
                            <span
                                className="bg-gray-300"
                                style={{ width: barWidthsMock[8] }}
                            />
                        </div>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {mergeMethods.map((item) => (
                                <div
                                    key={item.term}
                                    className="flex justify-between py-2">
                                    <dt className="text-sm text-gray-500">{item.term}</dt>
                                    <dd className="text-sm font-semibold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <h3 className="text-lg font-bold">Issue와 연결된 PR</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            개발 결과가 Issue 해결로 이어진 정도예요.
                        </p>
                        <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm text-gray-500">Issue를 연결한 PR</dt>
                                <dd className="mt-2 text-2xl font-bold">
                                    {summaryMock.linkedIssues}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">
                                    병합으로 자동 종료된 Issue
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">{summaryMock.linkedPrs}</dd>
                            </div>
                        </dl>
                    </article>
                </div>
            </section>
        </section>
    );
}
