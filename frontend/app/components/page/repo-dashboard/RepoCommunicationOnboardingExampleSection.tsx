import UpcomingBackdrop from "~/components/common/UpcomingBackdrop";
import { useParams } from "react-router";
import { useRepoCommunication } from "~/hooks/api/useRepoCommunication";
import RepoCommunicationQueryState from "./RepoCommunicationQueryState";
import {
    contributorMetricsMock as contributorMetrics,
    issueReadinessMock as issueReadiness,
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
                        {index < 2 ? (
                            <>
                                <strong className="block text-2xl">
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
                                </strong>
                                <p className="text-xs text-gray-500">{item.detail}</p>
                            </>
                        ) : (
                            <UpcomingBackdrop />
                        )}
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
                                    <span className="text-sm">{item.label}</span>
                                    <UpcomingBackdrop />
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">최근 병합된 첫 기여</h3>
                <UpcomingBackdrop />
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">기여 시작 난이도</h3>
                <UpcomingBackdrop />
            </article>
        </section>
    );
}
