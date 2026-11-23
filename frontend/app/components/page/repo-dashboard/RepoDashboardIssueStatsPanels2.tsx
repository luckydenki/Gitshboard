import type { View } from "./RepoDashboardIssueStatsSection";

export default function RepoDashboardIssueStatsPanels2({
    issueTypes,
    milestones,
    issueAssignments,
    issueCommentDistribution,
    issueCloseReasons,
    barWidths,
    summary,
    popular,
}: Pick<
    View,
    | "issueTypes"
    | "milestones"
    | "issueAssignments"
    | "issueCommentDistribution"
    | "issueCloseReasons"
    | "barWidths"
    | "summary"
    | "popular"
>) {
    return (
        <>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">유형별 해결 속도</h3>
                <p className="text-xs text-gray-500">종료까지 걸린 시간의 중앙값</p>
                <ul className="flex flex-col gap-4">
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
                                    className="h-full rounded-lg bg-gray-500"
                                    style={{ width: item.width }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">마일스톤 진행률</h3>
                <ul className="flex flex-col gap-5">
                    {!milestones.length && (
                        <li className="text-sm text-gray-500">집계할 데이터가 없습니다.</li>
                    )}
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

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">참여 가능한 Issue</h3>
                <dl className="flex flex-col divide-y divide-gray-300">
                    {issueAssignments.map((item) => (
                        <div
                            key={item.term}
                            className="flex items-center justify-between gap-3 py-3">
                            <div className="flex flex-col gap-1">
                                <dt className="text-sm font-medium">{item.term}</dt>
                                <p className="text-xs text-gray-500">{item.detail}</p>
                            </div>
                            <dd className="text-lg font-bold">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">댓글 수 분포</h3>
                <p className="text-xs text-gray-500">Issue당 댓글</p>
                <ul className="flex flex-col gap-3">
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
                                    className="h-full rounded-lg bg-gray-500"
                                    style={{ width: item.width }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">관심이 높은 Issue</h3>
                {popular ?? <p className="text-sm text-gray-500">표시할 인기 Issue가 없습니다.</p>}
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <h3 className="text-lg font-bold">Issue 종료 사유</h3>
                <p className="text-xs text-gray-500">전체 기간 · 현재 닫힌 Issue</p>
                <div
                    role="img"
                    className="flex h-4 overflow-hidden rounded-lg bg-gray-200"
                    aria-label={summary.issueCloseDistribution}>
                    <span
                        className="bg-gray-500"
                        style={{ width: barWidths[0] }}
                    />
                    <span
                        className="bg-gray-400"
                        style={{ width: barWidths[1] }}
                    />
                    <span
                        className="bg-gray-300"
                        style={{ width: barWidths[2] }}
                    />
                    <span
                        className="bg-gray-300"
                        style={{ width: barWidths[3] }}
                    />
                </div>
                <dl className="flex flex-wrap gap-3">
                    {issueCloseReasons.map((item) => (
                        <div
                            key={item.term}
                            className="flex w-full flex-col gap-1 md:w-[calc(50%-0.375rem)] xl:w-[calc(25%-0.5625rem)]">
                            <dt className="text-xs text-gray-500">{item.term}</dt>
                            <dd className="font-bold">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </article>
        </>
    );
}
