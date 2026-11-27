import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import {
    formatAttemptsPerWeek,
    formatCount,
    getDeploymentHourBars,
    getDeploymentMetrics,
} from "~/utils/page/repo-project-status";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusDeploymentRhythmPanel({ status }: Props) {
    const { deploymentsQuery, deployments } = status;
    return (
        <DashboardPanelLayout
            title="배포 리듬"
            semititle="수집된 배포 기록의 소요 시간과 시간대예요.">
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
                    <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                        {deployments?.attempts
                            ? formatAttemptsPerWeek(deployments)
                            : "배포 기록 없음"}
                    </span>
                    {deployments?.attempts ? (
                        <>
                            <dl className="flex flex-wrap gap-4">
                                {getDeploymentMetrics(deployments).map(([label, value, detail]) => (
                                    <div
                                        key={label}
                                        className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-4 md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333333%-0.666667rem)]">
                                        <dt className="text-xs text-gray-500">{label}</dt>
                                        <dd className="text-xl font-bold">{value}</dd>
                                        <p className="text-xs leading-5 text-gray-500">{detail}</p>
                                    </div>
                                ))}
                            </dl>
                            <div className="flex flex-col gap-4 pt-5">
                                <h4 className="text-sm font-semibold">시간대별 배포 비중</h4>
                                {deployments.hourBuckets.length > 0 ? (
                                    <ul className="flex flex-col gap-3">
                                        {getDeploymentHourBars(deployments).map(
                                            ({ hour, count, label, width }) => (
                                                <li
                                                    key={hour}
                                                    className="flex items-center gap-3">
                                                    <span className="w-20 shrink-0 text-xs text-gray-500">
                                                        {label}
                                                    </span>
                                                    <div className="h-3 flex-1 rounded-lg bg-gray-200">
                                                        <div
                                                            className="h-full rounded-lg bg-gray-500"
                                                            style={{
                                                                width,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-10 text-right text-xs font-semibold">
                                                        {formatCount(count)}
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        시간대별 배포 기록이 없습니다.
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            배포 리듬 정보가 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
