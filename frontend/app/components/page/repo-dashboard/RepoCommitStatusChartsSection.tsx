import type { RepoCommitStatusOverviewDto } from "~/types/response/repo-commit-status";
import {
    completeCommitValue,
    formatCommitNumber,
    formatCommitPeriod,
} from "~/utils/page/repo-commit-status";
import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoCommitStatusWeeklyChart from "./RepoCommitStatusWeeklyChart";
import RepoCommitStatusCodeChangeChart from "./RepoCommitStatusCodeChangeChart";
import RepoCommitStatusTimeChart from "./RepoCommitStatusTimeChart";
type Props = { overview: RepoCommitStatusOverviewDto };
export default function RepoCommitStatusChartsSection({ overview }: Props) {
    const weekly = completeCommitValue(overview.weekly);
    const code = completeCommitValue(overview.codeChange);
    const time = completeCommitValue(overview.timeOfDay);
    return (
        <>
            <DashboardPanelLayout
                title="최근 1년 주별 커밋 추이"
                semititle="기본 브랜치의 병합 커밋을 포함한 주별 커밋 수예요.">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2 text-right">
                        <strong className="text-xl">
                            {weekly
                                ? formatCommitNumber(
                                      weekly.points.reduce((sum, point) => sum + point.count, 0),
                                  )
                                : "—"}
                        </strong>
                        <p className="text-xs text-gray-500">
                            {weekly ? formatCommitPeriod(weekly.period, overview.timezone) : ""}
                        </p>
                    </div>
                </div>
                {weekly && (
                    <RepoCommitStatusWeeklyChart
                        points={weekly.points}
                        timezone={overview.timezone}
                    />
                )}
            </DashboardPanelLayout>
            <div className="flex items-stretch gap-6 not-xl:flex-col [&>section]:flex-1">
                <DashboardPanelLayout title="코드 변화량">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">
                                1년 전 날짜가 속한 주부터 ·{" "}
                                {code ? formatCommitPeriod(code.period, overview.timezone) : ""}
                            </p>
                        </div>
                        <strong className="text-xl">
                            {code
                                ? `${code.net > 0 ? "+" : ""}${formatCommitNumber(code.net)}줄`
                                : "—"}
                        </strong>
                    </div>
                    {code && (
                        <RepoCommitStatusCodeChangeChart
                            points={code.points}
                            timezone={overview.timezone}
                        />
                    )}
                    {code && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                                <span>코드 추가 {formatCommitNumber(code.additions)}줄</span>
                                <span>코드 삭제 {formatCommitNumber(code.deletions)}줄</span>
                            </div>
                            <div
                                role="img"
                                aria-label={
                                    code.additionsPercent === null
                                        ? "이 기간에는 코드 추가와 삭제가 없습니다."
                                        : `코드 추가 ${formatCommitNumber(code.additionsPercent)}%, 코드 삭제 ${formatCommitNumber(code.deletionsPercent ?? 0)}%`
                                }
                                className="flex h-3 overflow-hidden rounded-lg bg-gray-200">
                                <span
                                    className="h-full bg-gray-500"
                                    style={{ width: `${code.additionsPercent ?? 0}%` }}
                                />
                                <span
                                    className="h-full bg-gray-300"
                                    style={{ width: `${code.deletionsPercent ?? 0}%` }}
                                />
                            </div>
                        </div>
                    )}
                </DashboardPanelLayout>
                <DashboardPanelLayout
                    title="시간대별 커밋 분포"
                    semititle="최근 완료된 90일 기준">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="text-right">
                            <strong className="text-xl">
                                {time?.peakStartHour === null
                                    ? "기록 없음"
                                    : `${String(time?.peakStartHour ?? 0).padStart(2, "0")}시`}
                            </strong>
                            <p className="text-xs text-gray-500">가장 활발한 시간대</p>
                        </div>
                    </div>
                    {time && <RepoCommitStatusTimeChart buckets={time.buckets} />}
                    <p className="text-xs leading-5 text-gray-500">
                        {time?.middayPercent === null
                            ? "해당 기간 커밋이 없습니다."
                            : `전체 커밋의 ${formatCommitNumber(time?.middayPercent ?? 0)}%가 12시부터 20시 사이에 등록됐어요.`}
                    </p>
                </DashboardPanelLayout>
            </div>
        </>
    );
}
