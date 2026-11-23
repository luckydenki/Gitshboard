import { useParams } from "react-router";
import { useRepoCommunication } from "~/hooks/api/useRepoCommunication";
import RepoCommunicationQueryState from "./RepoCommunicationQueryState";
import { FiUsers } from "react-icons/fi";
export default function RepoCommunicationContributorsArticle() {
    const { owner, repo } = useParams();
    const query = useRepoCommunication(owner, repo, "contributors");
    return (
        <article className="bg-panel flex flex-col gap-5 rounded-lg border border-gray-300 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">상위 기여자</h3>
                    <p className="text-sm text-gray-500">
                        전체 기간의 커밋 기여를 기준으로 했어요.
                    </p>
                </div>
                <span className="flex items-center gap-2 text-xs text-gray-500">
                    <FiUsers aria-hidden="true" />
                    {query.data?.contributors?.value
                        ? `총 ${query.data.contributors.value.totalEntries.toLocaleString()}명`
                        : "—"}
                </span>
            </div>
            <RepoCommunicationQueryState
                pending={query.isPending}
                error={query.isError}
                metric={query.data?.contributors}
                onRetry={() => void query.refetch()}>
                {(value) => (
                    <>
                        {value.top.length === 0 ? (
                            <p className="min-h-24 text-sm text-gray-500">
                                표시할 기여자가 없습니다.
                            </p>
                        ) : (
                            <ol className="flex flex-col divide-y divide-gray-300">
                                {value.top.map((contributor, index) => (
                                    <li
                                        key={contributor.login}
                                        className="flex items-center gap-4 py-4">
                                        <span className="w-6 text-xs font-bold text-gray-500">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <img
                                            src={contributor.avatarUrl}
                                            alt=""
                                            className="size-12 shrink-0 rounded-lg border border-gray-300"
                                        />
                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <p className="wrap-break-words font-semibold">
                                                @{contributor.login}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {contributor.commits.toLocaleString()} commits
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {contributor.sharePercent === null
                                                ? "—"
                                                : `${contributor.sharePercent.toFixed(1)}%`}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </>
                )}
            </RepoCommunicationQueryState>
        </article>
    );
}
