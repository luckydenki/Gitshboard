import { useParams } from "react-router";
import { useRepoCommunication } from "~/hooks/api/useRepoCommunication";
import RepoCommunicationQueryState from "./RepoCommunicationQueryState";
import { summaryMock } from "~/mock/repo-dashboard/communication";
export default function RepoCommunicationDiscussionStats() {
    const { owner, repo } = useParams();
    const query = useRepoCommunication(owner, repo, "discussions");
    return (
        <>
            <article className="bg-panel flex w-full min-w-0 flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">Discussion 카테고리</h3>
                        <p className="text-sm text-gray-500">전체 게시물의 주제별 분포</p>
                    </div>
                    <strong className="text-xl">
                        {query.data?.distribution?.value
                            ? `${query.data.distribution.value.total}개`
                            : "—"}
                    </strong>
                </div>
                <RepoCommunicationQueryState
                    pending={query.isPending}
                    error={query.isError}
                    metric={query.data?.distribution}
                    onRetry={() => void query.refetch()}>
                    {(value) => (
                        <>
                            {value.total === 0 ? (
                                <p className="min-h-24 text-sm text-gray-500">
                                    Discussion이 없습니다.
                                </p>
                            ) : (
                                <ul className="flex flex-col gap-4">
                                    {value.categories.map((category) => (
                                        <li
                                            key={category.name}
                                            className="flex flex-col gap-2">
                                            <div className="flex justify-between gap-3 text-sm">
                                                <span>{category.name}</span>
                                                <span className="text-gray-500">
                                                    {category.count}개 ·{" "}
                                                    {category.percent === null
                                                        ? "—"
                                                        : category.percent.toFixed(1)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-lg bg-gray-200">
                                                <div
                                                    className="h-full rounded-lg bg-gray-500"
                                                    style={{
                                                        width: `${category.percent === null ? "—" : category.percent.toFixed(1)}%`,
                                                    }}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </RepoCommunicationQueryState>
            </article>
            <article className="bg-panel flex w-full flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">답변과 응답</h3>
                <dl className="flex flex-col divide-y divide-gray-300">
                    <div className="flex items-center justify-between gap-3 py-4">
                        <dt className="text-sm text-gray-500">답변 완료율</dt>
                        <dd className="text-xl font-bold">
                            <RepoCommunicationQueryState
                                pending={query.isPending}
                                error={query.isError}
                                metric={query.data?.responses}
                                onRetry={() => void query.refetch()}>
                                {(value) => (
                                    <>
                                        {value.answeredPercent === null
                                            ? "해당 없음"
                                            : `${value.answeredPercent.toFixed(1)}%`}
                                    </>
                                )}
                            </RepoCommunicationQueryState>
                        </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-4">
                        <dt className="text-sm text-gray-500">Discussion에서 해결</dt>
                        <dd className="text-xl font-bold">{summaryMock.resolvedDiscussions}</dd>
                    </div>
                </dl>
                <p className="text-xs leading-5 text-gray-500">{summaryMock.resolvedPeriod}</p>
            </article>
        </>
    );
}
