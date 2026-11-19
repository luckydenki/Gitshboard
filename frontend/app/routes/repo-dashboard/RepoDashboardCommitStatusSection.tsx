import { useParams } from "react-router";
import {
    useRepoDashboardCommitStatusOverview,
    useRepoDashboardCommitStatusRecords,
} from "~/hooks/api/useRepoDashboardCommitStatus";
import {
    completeCommitValue,
    formatCommitChange,
    formatCommitNumber,
    formatCommitPeriod,
} from "~/utils/page/repo-commit-status";
import RepoCommitStatusCodeChangeChart from "../../components/page/repo-dashboard/RepoCommitStatusCodeChangeChart";
import RepoCommitStatusQueryState from "../../components/page/repo-dashboard/RepoCommitStatusQueryState";
import RepoCommitStatusRecordsList from "../../components/page/repo-dashboard/RepoCommitStatusRecordsList";
import RepoCommitStatusTimeChart from "../../components/page/repo-dashboard/RepoCommitStatusTimeChart";
import RepoCommitStatusWeeklyChart from "../../components/page/repo-dashboard/RepoCommitStatusWeeklyChart";

/** 저장소 기본 브랜치의 완료된 최근 기간 커밋 현황입니다. */
export default function RepoDashboardCommitStatusSection() {
    const { owner, repo } = useParams();
    const overviewQuery = useRepoDashboardCommitStatusOverview(owner, repo);
    const recordsQuery = useRepoDashboardCommitStatusRecords(owner, repo);
    const overview = overviewQuery.data;
    const yearly = overview && completeCommitValue(overview.yearly);
    const periods = overview && completeCommitValue(overview.periods);
    const weekly = overview && completeCommitValue(overview.weekly);
    const code = overview && completeCommitValue(overview.codeChange);
    const time = overview && completeCommitValue(overview.timeOfDay);
    const total = yearly?.count ?? null;
    const partial =
        overview &&
        [
            overview.yearly,
            overview.periods,
            overview.weekly,
            overview.codeChange,
            overview.timeOfDay,
        ].some((metric) => metric.status !== "complete");

    return (
        <section
            aria-label="커밋 현황"
            className="flex min-w-0 flex-col gap-6">
            {overviewQuery.isLoading ? (
                <RepoCommitStatusQueryState state="loading" />
            ) : overviewQuery.isError || !overview ? (
                <RepoCommitStatusQueryState
                    state="error"
                    onRetry={() => overviewQuery.refetch()}
                />
            ) : partial ? (
                <RepoCommitStatusQueryState
                    state="partial"
                    onRetry={() => overviewQuery.refetch()}
                />
            ) : total === 0 ? (
                <RepoCommitStatusQueryState state="empty" />
            ) : (
                <>
                    <div className="flex items-stretch gap-6 not-xl:flex-col">
                        <article className="bg-panel flex min-w-72 flex-2 flex-col justify-between gap-8 divide-y divide-gray-300 rounded-lg border border-gray-300 p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-gray-500">최근 1년 커밋</p>
                                    <strong className="block text-4xl">
                                        {total === null ? "—" : formatCommitNumber(total)}
                                    </strong>
                                </div>
                                <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                                    {overview.branch ?? "기본 브랜치"}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-end justify-between gap-4 pt-5">
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-gray-500">이전 동일 기간 대비</p>
                                    <p className="text-primary text-lg font-bold">
                                        {yearly ? formatCommitChange(yearly.changePercent) : "—"}
                                    </p>
                                </div>
                                <p className="max-w-sm text-right text-xs leading-5 text-gray-500">
                                    {yearly
                                        ? `${formatCommitNumber(yearly.previousCount)}개에서 ${formatCommitNumber(yearly.count)}개로 변화했어요.`
                                        : ""}
                                </p>
                            </div>
                        </article>
                        <div className="flex min-w-0 flex-3 flex-wrap gap-4">
                            {periods?.map(({ days, count, changePercent }) => (
                                <article
                                    key={days}
                                    className="bg-panel flex min-w-44 flex-1 flex-col gap-3 rounded-lg border border-gray-300 p-6">
                                    <p className="text-sm text-gray-500">최근 완료된 {days}일</p>
                                    <strong className="block text-3xl">
                                        {formatCommitNumber(count)}
                                    </strong>
                                    <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                                        <span className="text-gray-500">이전 동일 기간</span>
                                        <span className="font-semibold">
                                            {formatCommitChange(changePercent)}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                    <article className="bg-panel flex flex-col gap-6 rounded-lg border border-gray-300 p-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold">최근 1년 주별 커밋 추이</h3>
                                <p className="text-sm text-gray-500">
                                    기본 브랜치의 병합 커밋을 포함한 주별 커밋 수예요.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 text-right">
                                <strong className="text-xl">
                                    {weekly
                                        ? formatCommitNumber(
                                              weekly.points.reduce(
                                                  (sum, point) => sum + point.count,
                                                  0,
                                              ),
                                          )
                                        : "—"}
                                </strong>
                                <p className="text-xs text-gray-500">
                                    {weekly
                                        ? formatCommitPeriod(weekly.period, overview.timezone)
                                        : ""}
                                </p>
                            </div>
                        </div>
                        {weekly && (
                            <RepoCommitStatusWeeklyChart
                                points={weekly.points}
                                timezone={overview.timezone}
                            />
                        )}
                    </article>
                    <div className="flex items-stretch gap-6 not-xl:flex-col">
                        <article className="bg-panel flex min-w-0 flex-1 flex-col gap-5 rounded-lg border border-gray-300 p-6">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-bold">코드 변화량</h3>
                                    <p className="text-sm text-gray-500">
                                        1년 전 날짜가 속한 주부터 ·{" "}
                                        {code
                                            ? formatCommitPeriod(code.period, overview.timezone)
                                            : ""}
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
                                        <span>
                                            코드 추가 {formatCommitNumber(code.additions)}줄
                                        </span>
                                        <span>
                                            코드 삭제 {formatCommitNumber(code.deletions)}줄
                                        </span>
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
                        </article>
                        <article className="bg-panel flex min-w-0 flex-1 flex-col gap-5 rounded-lg border border-gray-300 p-6">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-bold">시간대별 커밋 분포</h3>
                                    <p className="text-sm text-gray-500">최근 완료된 90일 기준</p>
                                </div>
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
                        </article>
                    </div>
                </>
            )}
            <RepoCommitStatusRecordsList
                records={recordsQuery.data}
                loading={recordsQuery.isLoading}
                error={recordsQuery.isError}
                onRetry={() => recordsQuery.refetch()}
            />
        </section>
    );
}
