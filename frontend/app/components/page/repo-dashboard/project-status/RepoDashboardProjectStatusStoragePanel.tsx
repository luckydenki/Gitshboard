import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { formatSize, makeLineOption } from "~/utils/page/repo-project-status";
import RepoDashboardProjectStatusChart from "./RepoDashboardProjectStatusChart";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusStoragePanel({ status }: Props) {
    const { overviewQuery, historyQuery, overview, history, storageHistory, hasStorageHistory } =
        status;
    return (
        <DashboardPanelLayout
            title="Git 저장소 용량"
            semititle="수집된 월별 디스크 사용량">
            <RepoDashboardProjectStatusQueryState
                loading={
                    historyQuery.isLoading ||
                    (historyQuery.isFetching && historyQuery.isError) ||
                    overviewQuery.isLoading ||
                    (overviewQuery.isFetching && overviewQuery.isError)
                }
                error={historyQuery.isError || overviewQuery.isError}
                onRetry={() => {
                    void historyQuery.refetch();
                    void overviewQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    <strong className="text-2xl">{formatSize(overview?.diskUsageKb)}</strong>
                    {hasStorageHistory ? (
                        <RepoDashboardProjectStatusChart
                            option={makeLineOption(storageHistory, "Git 저장소 용량")}
                            style={{ height: 200, width: "100%" }}
                        />
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            수집된 용량 이력이 없습니다.
                        </p>
                    )}
                    {Boolean(history?.coverage.unobservedDiskUsageMonths.length) ? (
                        <p className="text-xs text-gray-500">일부 월의 용량 정보가 없습니다.</p>
                    ) : null}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
