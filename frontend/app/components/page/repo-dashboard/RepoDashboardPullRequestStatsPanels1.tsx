import type { View } from "./RepoDashboardPullRequestStatsSection";

export default function RepoDashboardPullRequestStatsPanels1({
    prTimeline,
    prReviewMetrics,
    prSizes,
    barWidths,
    summary,
}: Pick<View, "prTimeline" | "prReviewMetrics" | "prSizes" | "barWidths" | "summary">) {
    return (
        <>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">PR 처리 결과</h3>
                <p className="text-xs text-gray-500">{summary.decidedPrPeriod}</p>
                <div
                    role="img"
                    className="flex h-4 overflow-hidden rounded-lg bg-gray-200"
                    aria-label={summary.prOutcomeDistribution}>
                    <span
                        className="bg-gray-500"
                        style={{ width: barWidths[4] }}
                    />
                    <span
                        className="bg-gray-400"
                        style={{ width: barWidths[5] }}
                    />
                </div>
                <dl className="flex justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <dt className="text-xs text-gray-500">병합률</dt>
                        <dd className="text-xl font-bold">{summary.mergedRate}</dd>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <dt className="text-xs text-gray-500">병합 없이 종료</dt>
                        <dd className="text-xl font-bold">{summary.closedPrRate}</dd>
                    </div>
                </dl>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">첫 리뷰까지</h3>
                <p className="text-sm text-gray-500">PR 생성부터 첫 리뷰</p>
                <strong className="block text-2xl">{summary.firstReviewTime}</strong>
                <p className="text-xs text-gray-500">중앙값</p>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">병합까지</h3>
                <p className="text-sm text-gray-500">PR 생성부터 병합</p>
                <dl className="flex gap-5">
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">중앙값</dt>
                        <dd className="text-xl font-bold">{summary.mergeTime}</dd>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">90백분위</dt>
                        <dd className="text-xl font-bold">{summary.longestPrTime}</dd>
                    </div>
                </dl>
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <h3 className="text-lg font-bold">PR 생성 후 리뷰·병합 흐름</h3>
                <p className="text-sm text-gray-500">중앙값 기준 누적 소요 시간</p>
                <ol className="flex items-stretch gap-3 not-sm:flex-col">
                    {prTimeline.map((item, index) => (
                        <li
                            key={item.label}
                            className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg bg-gray-100 p-4">
                            <span className="text-xs text-gray-500">0{index + 1}</span>
                            <span className="text-sm font-semibold">{item.label}</span>
                            <strong>{item.value}</strong>
                        </li>
                    ))}
                </ol>
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">PR당 협업 규모</h3>
                <p className="text-xs text-gray-500">
                    GitHub 봇 제외 · 일반 댓글과 코드 리뷰 댓글 포함
                </p>
                <dl className="flex flex-col divide-y divide-gray-300">
                    {prReviewMetrics.map((item) => (
                        <div
                            key={item.term}
                            className="flex justify-between gap-3 py-3">
                            <dt className="text-sm text-gray-500">{item.term}</dt>
                            <dd className="text-sm font-bold">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">PR 크기 분포</h3>
                        <p className="text-sm text-gray-500">변경한 코드 줄 수 기준</p>
                    </div>
                    <span className="text-sm font-semibold">{summary.changedFiles}</span>
                </div>
                <ul className="flex flex-col gap-4">
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
                                    className="h-full rounded-lg bg-gray-500"
                                    style={{
                                        width: `${item.percent}%`,
                                    }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">크기별 병합 속도</h3>
                <p className="text-xs text-gray-500">생성부터 병합까지 중앙값</p>
                <dl className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <dt className="text-sm text-gray-500">작은 PR · 100줄 이하</dt>
                        <dd className="text-xl font-bold">{summary.smallPrMergeTime}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                        <dt className="text-sm text-gray-500">큰 PR · 501줄 이상</dt>
                        <dd className="text-xl font-bold">{summary.largePrMergeTime}</dd>
                    </div>
                </dl>
            </article>
        </>
    );
}
