import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { chartColors, formatPercent, makePieOption } from "~/utils/page/repo-project-status";
import RepoDashboardProjectStatusChart from "./RepoDashboardProjectStatusChart";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusLanguagePanel({ status }: Props) {
    const { overviewQuery, overview, languageData } = status;
    return (
        <DashboardPanelLayout
            title="언어 구성"
            semititle="저장소 전체 코드를 언어별로 나눈 비중이에요.">
            <RepoDashboardProjectStatusQueryState
                loading={
                    overviewQuery.isLoading || (overviewQuery.isFetching && overviewQuery.isError)
                }
                error={overviewQuery.isError}
                onRetry={() => {
                    void overviewQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {languageData.length > 0 ? (
                        <div>
                            <RepoDashboardProjectStatusChart
                                option={makePieOption("언어 구성", languageData)}
                                className="h-64 w-full"
                            />
                            <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                                {overview?.languages.map(({ name, sharePercent }, index) => (
                                    <li
                                        key={name}
                                        className="flex items-center justify-between gap-3 py-2">
                                        <span className="flex min-w-0 items-center gap-2 text-sm break-words">
                                            <span
                                                aria-hidden="true"
                                                className="size-2.5 shrink-0 rounded-lg"
                                                style={{
                                                    backgroundColor:
                                                        chartColors[index % chartColors.length],
                                                }}
                                            />
                                            {name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatPercent(sharePercent)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            언어 정보가 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
