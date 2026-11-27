import type { View } from "./RepoDashboardPullRequestStatsSection";

export default function RepoDashboardPullRequestStatsPanels2({
    prMetrics,
    mergeMethods,
    barWidths,
    summary,
}: Pick<View, "prMetrics" | "mergeMethods" | "barWidths" | "summary">) {
    return (
        <>
            <div className="flex w-full min-w-0 flex-wrap gap-4 md:w-full xl:w-full">
                {prMetrics.map((item) => (
                    <article
                        key={item.label}
                        className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-5 md:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
                        <h3 className="text-sm text-gray-500">{item.label}</h3>
                        <strong className="block text-xl">{item.value}</strong>
                        <p className="text-xs leading-5 text-gray-500">{item.detail}</p>
                    </article>
                ))}
            </div>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">병합 방식</h3>
                <p className="text-xs text-gray-500">병합된 PR 기준</p>
                <div
                    role="img"
                    className="flex h-4 overflow-hidden rounded-lg bg-gray-200"
                    aria-label={summary.mergeMethodDistribution}>
                    <span
                        className="bg-gray-500"
                        style={{ width: barWidths[6] }}
                    />
                    <span
                        className="bg-gray-400"
                        style={{ width: barWidths[7] }}
                    />
                    <span
                        className="bg-gray-300"
                        style={{ width: barWidths[8] }}
                    />
                </div>
                <dl className="flex flex-col divide-y divide-gray-300">
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

            <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <h3 className="text-lg font-bold">Issue와 연결된 PR</h3>
                <p className="text-sm text-gray-500">개발 결과가 Issue 해결로 이어진 정도예요.</p>
                <dl className="flex flex-wrap gap-4">
                    <div className="flex w-full flex-col gap-2 md:w-[calc(50%-0.5rem)]">
                        <dt className="text-sm text-gray-500">Issue를 연결한 PR</dt>
                        <dd className="text-2xl font-bold">{summary.linkedIssues}</dd>
                    </div>
                    <div className="flex w-full flex-col gap-2 md:w-[calc(50%-0.5rem)]">
                        <dt className="text-sm text-gray-500">참조된 Issue</dt>
                        <dd className="text-2xl font-bold">{summary.linkedPrs}</dd>
                    </div>
                </dl>
            </article>
        </>
    );
}
