import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import {
    chartColors,
    fileTypeLabels,
    formatCount,
    formatPercent,
    makePieOption,
} from "~/utils/page/repo-project-status";
import RepoDashboardProjectStatusChart from "./RepoDashboardProjectStatusChart";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusFileTypesPanel({ status }: Props) {
    const { filesQuery, files, fileTypeData } = status;
    return (
        <DashboardPanelLayout
            title="파일 구성"
            semititle="소스, 테스트, 문서, 설정 파일의 비율이에요.">
            <RepoDashboardProjectStatusQueryState
                loading={filesQuery.isLoading || (filesQuery.isFetching && filesQuery.isError)}
                error={filesQuery.isError}
                onRetry={() => {
                    void filesQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {fileTypeData.length > 0 ? (
                        <div>
                            {files?.fileCount === null ? (
                                <p className="text-sm text-gray-500">
                                    전체 파일을 확인하지 못해 비율을 표시할 수 없습니다.
                                </p>
                            ) : (
                                <RepoDashboardProjectStatusChart
                                    option={makePieOption("파일 구성", fileTypeData)}
                                    className="h-64 w-full"
                                />
                            )}
                            <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                                {files?.fileTypes.map(({ type, count, sharePercent }, index) => (
                                    <li
                                        key={type}
                                        className="flex items-center justify-between gap-3 py-2">
                                        <span className="flex min-w-0 items-center gap-2 text-sm break-words">
                                            <span
                                                aria-hidden="true"
                                                className="size-2.5 shrink-0 rounded-lg"
                                                style={{ backgroundColor: chartColors[index] }}
                                            />
                                            {fileTypeLabels[type]}
                                        </span>
                                        <span className="text-right text-xs text-gray-500">
                                            {formatCount(count)} · {formatPercent(sharePercent)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            분류한 파일이 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
