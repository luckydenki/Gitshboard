import RepoIssueFlowChart from "./RepoIssueFlowChart";
import type { View } from "./RepoDashboardIssueStatsSection";

export default function RepoDashboardIssueStatsPanels1({
    weeks,
    timezone,
    unavailable,
    issueProcessing,
    issueAge,
    issueLabels,
    summary,
}: Pick<
    View,
    | "weeks"
    | "timezone"
    | "unavailable"
    | "issueProcessing"
    | "issueAge"
    | "issueLabels"
    | "summary"
>) {
    return (
        <>
            <article className="bg-panel w-full min-w-0 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">Issue 신규·종료 추이</h3>
                        <p className="text-sm text-gray-500">{summary.issuePeriod}</p>
                    </div>
                    <div className="flex gap-5 text-sm">
                        <span>
                            <strong className="text-gray-500">{summary.openedIssues}</strong> 신규
                        </span>
                        <span>
                            <strong>{summary.closedIssues}</strong> 종료
                        </span>
                    </div>
                </div>
                <RepoIssueFlowChart
                    weeks={weeks}
                    timezone={timezone}
                />
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">처리 흐름</h3>
                <dl className="flex flex-col divide-y divide-gray-300">
                    {issueProcessing.map((item) => (
                        <div
                            key={item.term}
                            className="flex items-center justify-between gap-3 py-4">
                            <div className="flex flex-col gap-1">
                                <dt className="text-sm font-medium">{item.term}</dt>
                                <p className="text-xs text-gray-500">{item.detail}</p>
                            </div>
                            <dd className="text-lg font-bold text-gray-500">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">첫 응답까지</h3>
                <p className="text-sm text-gray-500">Issue 등록부터 첫 유지관리자 응답</p>
                <dl className="flex gap-5">
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">중앙값</dt>
                        <dd className="text-xl font-bold">{unavailable}</dd>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">90백분위</dt>
                        <dd className="text-xl font-bold">{unavailable}</dd>
                    </div>
                </dl>
            </article>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">종료까지</h3>
                <p className="text-sm text-gray-500">Issue 등록부터 종료</p>
                <dl className="flex gap-5">
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">중앙값</dt>
                        <dd className="text-xl font-bold">{summary.issueCloseTime}</dd>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">90백분위</dt>
                        <dd className="text-xl font-bold">{summary.oldestIssue}</dd>
                    </div>
                </dl>
            </article>
            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">장기 대기와 재오픈</h3>
                <dl className="flex flex-col divide-y divide-gray-300">
                    <div className="flex items-center justify-between gap-3 py-3">
                        <dt className="text-sm text-gray-500">30일 이상 활동 없음</dt>
                        <dd className="text-xl font-bold">{unavailable}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 py-3">
                        <dt className="text-sm text-gray-500">재오픈 비율</dt>
                        <dd className="text-xl font-bold">{unavailable}</dd>
                    </div>
                </dl>
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">열린 Issue 경과일</h3>
                <ul className="flex flex-col gap-4">
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
                <h3 className="text-lg font-bold">라벨별 Issue</h3>
                <p className="text-xs text-gray-500">열린 Issue 기준 · 라벨 중복 집계</p>
                <ul className="flex flex-col gap-4">
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
        </>
    );
}
