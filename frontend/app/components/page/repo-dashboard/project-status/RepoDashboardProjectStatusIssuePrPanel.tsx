import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { formatCount, getProjectIssuePrTotals } from "~/utils/page/repo-project-status";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusIssuePrPanel({ status }: Props) {
    const { overviewQuery, overview } = status;
    return (
        <DashboardPanelLayout
            title="이슈와 Pull Request"
            semititle="현재 열린 수와 전체 기간 누적">
            <RepoDashboardProjectStatusQueryState
                loading={
                    overviewQuery.isLoading || (overviewQuery.isFetching && overviewQuery.isError)
                }
                error={overviewQuery.isError}
                onRetry={() => {
                    void overviewQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {overview ? (
                        <dl className="flex flex-wrap divide-x divide-gray-300">
                            {getProjectIssuePrTotals(overview).map(([label, value]) => (
                                <div
                                    key={String(label)}
                                    className="flex min-w-32 flex-1 flex-col gap-2 px-4">
                                    <dt className="text-xs text-gray-500">{label}</dt>
                                    <dd className="text-xl font-bold">{formatCount(value)}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            이슈와 PR 정보가 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
