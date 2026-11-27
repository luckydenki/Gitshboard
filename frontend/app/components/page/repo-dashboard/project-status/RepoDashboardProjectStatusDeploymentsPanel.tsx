import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { formatCount, formatPercent } from "~/utils/page/repo-project-status";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusDeploymentsPanel({ status }: Props) {
    const { deploymentsQuery, deployments } = status;
    return (
        <DashboardPanelLayout
            title="배포 결과"
            semititle="수집된 배포 기록 기준">
            <RepoDashboardProjectStatusQueryState
                loading={
                    deploymentsQuery.isLoading ||
                    (deploymentsQuery.isFetching && deploymentsQuery.isError)
                }
                error={deploymentsQuery.isError}
                onRetry={() => {
                    void deploymentsQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {deployments ? (
                        deployments.attempts === 0 ? (
                            <p className="text-sm text-gray-500">배포 기록이 없습니다.</p>
                        ) : (
                            <>
                                <strong className="block text-3xl">
                                    {formatPercent(deployments.successRatePercent)}
                                </strong>
                                <p className="text-sm text-gray-500">
                                    완료된 배포 {formatCount(deployments.completed)}회 중{" "}
                                    {formatCount(deployments.successful)}회 성공
                                </p>
                                <div className="h-3 rounded-lg bg-gray-200">
                                    <div
                                        className="h-full rounded-lg bg-gray-500"
                                        style={{ width: `${deployments.successRatePercent ?? 0}%` }}
                                    />
                                </div>
                                {deployments.partial ? (
                                    <p className="text-xs text-gray-500">
                                        일부 배포 기록이 제외되었습니다.
                                    </p>
                                ) : null}
                            </>
                        )
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            배포 기록이 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
