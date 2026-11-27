import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { formatCount, formatMonth, makeLineOption } from "~/utils/page/repo-project-status";
import RepoDashboardProjectStatusChart from "./RepoDashboardProjectStatusChart";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusContributorsPanel({ status }: Props) {
    const { participationQuery, participation, contributorHistory, hasContributorHistory } = status;
    return (
        <DashboardPanelLayout
            title="기여자 증가 추이"
            semititle="저장소에 커밋을 남긴 누적 기여자">
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
                    <strong className="text-xl">
                        {participation?.latestContributorMonth
                            ? `${formatCount(participation.latestContributorCount)}명 · ${formatMonth(participation.latestContributorMonth)}`
                            : "정보 없음"}
                    </strong>
                    {hasContributorHistory ? (
                        <RepoDashboardProjectStatusChart
                            option={makeLineOption(contributorHistory, "누적 기여자")}
                            style={{ height: 250, width: "100%" }}
                        />
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            수집된 기여자 이력이 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
