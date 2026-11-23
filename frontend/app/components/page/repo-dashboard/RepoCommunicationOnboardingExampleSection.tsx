import { useParams } from "react-router";
import { useRepoCommunication } from "~/hooks/api/useRepoCommunication";
import RepoCommunicationQueryState from "./RepoCommunicationQueryState";
import {
    contributorMetricsMock as contributorMetrics,
    issueReadinessMock as issueReadiness,
    summaryMock,
} from "~/mock/repo-dashboard/communication";
export default function RepoCommunicationOnboardingExampleSection() {
    const { owner, repo } = useParams();
    const query = useRepoCommunication(owner, repo, "onboarding");
    return (
        <section
            aria-label="신규 기여자 현황"
            className="flex flex-wrap gap-6">
            <div className="flex w-full min-w-0 flex-wrap gap-4 md:w-full xl:w-full">
                {contributorMetrics.map((item, index) => (
                    <article
                        key={item.label}
                        className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-5 md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333333%-0.666667rem)]">
                        <h3 className="text-sm text-gray-500">{item.label}</h3>
                        <strong className="block text-2xl">
                            {index < 2 ? (
                                <RepoCommunicationQueryState
                                    pending={query.isPending}
                                    error={query.isError}
                                    metric={query.data?.openIssues}
                                    onRetry={() => void query.refetch()}>
                                    {(value) => (
                                        <>
                                            {index === 0
                                                ? value.goodFirstIssueCount
                                                : value.helpWantedCount}
                                            건
                                        </>
                                    )}
                                </RepoCommunicationQueryState>
                            ) : (
                                item.value
                            )}
                        </strong>
                        <p className="text-xs text-gray-500">{item.detail}</p>
                    </article>
                ))}
            </div>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">Issue 안내의 명확성</h3>
                <p className="text-sm text-gray-500">
                    열린 Issue에서 참여에 필요한 정보가 보이는 비율
                </p>
                <ul className="flex flex-col gap-5">
                    {issueReadiness.map((item) => (
                        <li
                            key={item.label}
                            className="flex flex-col gap-2">
                            {item.label === "담당자 명시" ? (
                                <RepoCommunicationQueryState
                                    pending={query.isPending}
                                    error={query.isError}
                                    metric={query.data?.openIssues}
                                    onRetry={() => void query.refetch()}>
                                    {(value) => (
                                        <>
                                            <div className="flex justify-between gap-3 text-sm">
                                                <span>{item.label}</span>
                                                <span className="font-semibold">
                                                    {value.assignedPercent === null
                                                        ? "해당 없음"
                                                        : `${value.assignedPercent.toFixed(1)}%`}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-lg bg-gray-200">
                                                <div
                                                    className="h-full rounded-lg bg-gray-500"
                                                    style={{
                                                        width: `${value.assignedPercent ?? 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </RepoCommunicationQueryState>
                            ) : (
                                <>
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span>{item.label}</span>
                                        <span className="font-semibold">{item.value}%</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="h-full rounded-lg bg-gray-500"
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <p className="border-gray-300 pt-4 text-xs leading-5 text-gray-500">
                    {summaryMock.readinessInsight}
                </p>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">최근 병합된 첫 기여</h3>
                <p className="text-sm text-gray-500">새 기여자의 PR 사례 · 예시 데이터</p>
                <div className="flex flex-col gap-3 rounded-lg border border-gray-300 p-4">
                    <span className="text-xs font-semibold text-gray-500">첫 PR 병합</span>
                    <strong className="text-base leading-6">
                        {summaryMock.firstContributionTitle}
                    </strong>
                    <p className="text-xs text-gray-500">
                        {summaryMock.firstContributionReference}
                    </p>
                    <div className="flex flex-wrap gap-3 border-gray-300 pt-3 text-xs text-gray-500">
                        <span>{summaryMock.firstContributionReviews}</span>
                        <span>{summaryMock.firstContributionMergeTime}</span>
                    </div>
                </div>
                <p className="text-xs leading-5 text-gray-500">
                    {summaryMock.firstContributionDescription}
                </p>
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">기여 시작 난이도</h3>
                    <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                        AI 요약 · 예시
                    </span>
                </div>
                <strong className="block text-2xl">{summaryMock.difficulty}</strong>
                <p className="text-sm leading-6 text-gray-500">{summaryMock.difficultyInsight}</p>
                <p className="border-gray-300 pt-4 text-xs leading-5 text-gray-500">
                    {summaryMock.difficultyEvidence}
                </p>
            </article>
        </section>
    );
}
