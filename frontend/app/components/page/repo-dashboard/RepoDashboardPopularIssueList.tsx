import type { RepoPopularIssuesDto } from "~/types/response/repo-popular-issues";

type Props = {
    data?: RepoPopularIssuesDto;
    loading: boolean;
    error: boolean;
    onRetry: () => void;
    embedded?: boolean;
};

export default function RepoDashboardPopularIssueList({
    data,
    loading,
    error,
    onRetry,
    embedded,
}: Props) {
    const content = (
        <>
            {loading ? (
                <RepoDashboardPopularIssueSkeleton />
            ) : error ? (
                <RepoDashboardPopularIssueRetry onRetry={onRetry} />
            ) : data?.status === "partial" ? (
                <p className="text-sm text-gray-500">
                    모든 데이터를 수집하지 못해 순위를 표시할 수 없습니다.
                </p>
            ) : !data?.issues?.length ? (
                <p className="text-sm text-gray-500">열린 Issue가 없습니다.</p>
            ) : (
                <ol className="flex flex-col divide-y divide-gray-300">
                    {data.issues.map((issue) => (
                        <li
                            key={issue.number}
                            className="flex items-start justify-between gap-3 py-3">
                            <a
                                className="min-w-0 cursor-pointer text-sm font-medium wrap-break-word hover:underline"
                                href={issue.url}
                                target="_blank"
                                rel="noreferrer">
                                {issue.title} #{issue.number}
                            </a>
                            <span className="shrink-0 text-xs text-gray-500">
                                댓글 {issue.comments} · 반응 {issue.reactions}
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </>
    );
    if (embedded) return content;
    return (
        <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
            <h3 className="text-lg font-bold">관심이 높은 Issue</h3>
            <p className="text-xs text-gray-500">열린 Issue · 댓글, 모든 반응과 마지막 활동 기준</p>
            {content}
        </article>
    );
}

export const RepoDashboardPopularIssueSkeleton = () => (
    <div
        className="h-28 animate-pulse rounded-lg bg-gray-200"
        aria-label="인기 Issue 불러오는 중"
    />
);
export const RepoDashboardPopularIssueRetry = ({ onRetry }: { onRetry: () => void }) => (
    <div
        role="alert"
        className="flex flex-col items-start gap-3">
        <p>인기 Issue를 불러오지 못했습니다.</p>
        <button
            type="button"
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-200"
            onClick={onRetry}>
            다시 시도
        </button>
    </div>
);
