import { useParams } from "react-router";
import {
    useRepoDashboardCommitStatusOverview,
    useRepoDashboardCommitStatusRecords,
} from "~/hooks/api/useRepoDashboardCommitStatus";
import { completeCommitValue } from "~/utils/page/repo-commit-status";
import RepoCommitStatusSummarySection from "~/components/page/repo-dashboard/RepoCommitStatusSummarySection";
import RepoCommitStatusChartsSection from "~/components/page/repo-dashboard/RepoCommitStatusChartsSection";
import RepoCommitStatusQueryState from "~/components/page/repo-dashboard/RepoCommitStatusQueryState";
import RepoCommitStatusRecordsList from "~/components/page/repo-dashboard/RepoCommitStatusRecordsList";
/** 저장소 기본 브랜치의 완료된 최근 기간 커밋 현황입니다. */
export default function RepoDashboardCommitStatusSection() {
    const { owner, repo } = useParams();
    const overviewQuery = useRepoDashboardCommitStatusOverview(owner, repo);
    const recordsQuery = useRepoDashboardCommitStatusRecords(owner, repo);
    const overview = overviewQuery.data;
    const yearly = overview && completeCommitValue(overview.yearly);
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
                    <RepoCommitStatusSummarySection overview={overview} />
                    <RepoCommitStatusChartsSection overview={overview} />
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
