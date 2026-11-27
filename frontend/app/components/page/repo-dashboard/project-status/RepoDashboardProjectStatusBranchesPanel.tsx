import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { formatCount, formatDate } from "~/utils/page/repo-project-status";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusBranchesPanel({ status }: Props) {
    const { branchesQuery, branches } = status;
    return (
        <DashboardPanelLayout
            title="브랜치 현황"
            semititle="최근 활성 및 오래된 브랜치 현황">
            <RepoDashboardProjectStatusQueryState
                loading={
                    branchesQuery.isLoading || (branchesQuery.isFetching && branchesQuery.isError)
                }
                error={branchesQuery.isError}
                onRetry={() => {
                    void branchesQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {branches ? (
                        <>
                            <dl className="flex gap-5">
                                <div className="flex flex-1 flex-col gap-2">
                                    <dt className="text-xs text-gray-500">전체 브랜치</dt>
                                    <dd className="text-2xl font-bold">
                                        {formatCount(branches.total)}
                                    </dd>
                                </div>
                                <div className="flex flex-1 flex-col gap-2">
                                    <dt className="text-xs text-gray-500">최근 활성</dt>
                                    <dd className="text-2xl font-bold text-gray-500">
                                        {formatCount(branches.active)}
                                    </dd>
                                </div>
                            </dl>
                            <div className="flex flex-col gap-2 pt-4">
                                <p className="text-xs text-gray-500">기본 브랜치</p>
                                <p className="font-semibold">
                                    {branches.defaultBranch ?? "정보 없음"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs text-gray-500">오래된 브랜치</p>
                                    <strong>{formatCount(branches.stale)}</strong>
                                </div>
                                {branches.oldest.length > 0 ? (
                                    <ul className="flex flex-col gap-2 text-xs text-gray-500">
                                        {branches.oldest.map(({ name, committedAt }) => (
                                            <li
                                                key={`${name}-${committedAt}`}
                                                className="flex justify-between gap-2">
                                                <span className="truncate">{name}</span>
                                                <span className="shrink-0">
                                                    {formatDate(committedAt)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        오래된 브랜치가 없습니다.
                                    </p>
                                )}
                            </div>
                            {branches.partial ? (
                                <p className="text-xs text-gray-500">
                                    일부 브랜치 정보가 아직 수집되지 않았습니다.
                                </p>
                            ) : null}
                        </>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            브랜치 정보가 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
