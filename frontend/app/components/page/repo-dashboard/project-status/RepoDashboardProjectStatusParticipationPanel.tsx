import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { makeParticipationOption } from "~/utils/page/repo-project-status";
import RepoDashboardProjectStatusChart from "./RepoDashboardProjectStatusChart";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusParticipationPanel({ status }: Props) {
    const { participationQuery, participation, participationHistory, hasParticipationHistory } =
        status;
    return (
        <DashboardPanelLayout
            title="Issue·PR 참여자 추이"
            semititle="월별 고유 작성자 기준">
            <RepoDashboardProjectStatusQueryState
                loading={
                    participationQuery.isLoading ||
                    (participationQuery.isFetching && participationQuery.isError)
                }
                error={participationQuery.isError}
                onRetry={() => {
                    void participationQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {hasParticipationHistory ? (
                        <RepoDashboardProjectStatusChart
                            option={makeParticipationOption(participationHistory)}
                            style={{ height: 270, width: "100%" }}
                        />
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            수집된 참여자 이력이 없습니다.
                        </p>
                    )}
                    {participation?.partial ? (
                        <p className="text-xs text-gray-500">일부 월의 참여자 정보가 없습니다.</p>
                    ) : null}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
