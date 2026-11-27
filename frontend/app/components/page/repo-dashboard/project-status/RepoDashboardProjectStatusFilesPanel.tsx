import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { formatCount, makeLineOption } from "~/utils/page/repo-project-status";
import RepoDashboardProjectStatusChart from "./RepoDashboardProjectStatusChart";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusFilesPanel({ status }: Props) {
    const { filesQuery, historyQuery, files, history, fileHistory, hasFileHistory } = status;
    return (
        <DashboardPanelLayout
            title="전체 파일"
            semititle="수집된 월별 파일 수 변화">
            <RepoDashboardProjectStatusQueryState
                loading={
                    historyQuery.isLoading ||
                    (historyQuery.isFetching && historyQuery.isError) ||
                    filesQuery.isLoading ||
                    (filesQuery.isFetching && filesQuery.isError)
                }
                error={historyQuery.isError || filesQuery.isError}
                onRetry={() => {
                    void historyQuery.refetch();
                    void filesQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    <strong className="text-2xl">{formatCount(files?.fileCount)}</strong>
                    {hasFileHistory ? (
                        <RepoDashboardProjectStatusChart
                            option={makeLineOption(fileHistory, "전체 파일")}
                            style={{ height: 200, width: "100%" }}
                        />
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            수집된 파일 이력이 없습니다.
                        </p>
                    )}
                    {files?.partial || Boolean(history?.coverage.missingFileCountMonths.length) ? (
                        <p className="text-xs text-gray-500">
                            일부 파일 데이터가 아직 수집되지 않았습니다.
                        </p>
                    ) : null}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
