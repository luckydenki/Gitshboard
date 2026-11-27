import { useParams } from "react-router";
import RepoDashboardIssueStatsSection from "~/components/page/repo-dashboard/RepoDashboardIssueStatsSection";
import RepoDashboardPopularIssueList from "~/components/page/repo-dashboard/RepoDashboardPopularIssueList";
import RepoDashboardPullRequestStatsSection from "~/components/page/repo-dashboard/RepoDashboardPullRequestStatsSection";
import { useRepoDashboardPopularIssues } from "~/hooks/api/useRepoDashboardPopularIssues";
import { useRepoIssueStats, useRepoPullRequestStats } from "~/hooks/api/useRepoPrIssueStats";

export default function RepoDashboardPullRequestIssueSection() {
    const { owner, repo } = useParams();
    const issues = useRepoIssueStats(owner, repo);
    const pulls = useRepoPullRequestStats(owner, repo);
    const popular = useRepoDashboardPopularIssues(owner, repo);
    return (
        <section
            aria-label="PR 및 이슈 현황"
            className="flex min-w-0 flex-col gap-6 divide-y divide-gray-300">
            <title>{`${owner}/${repo} PR 및 이슈 현황 - Gitshboard`}</title>
            <meta
                name="description"
                content="저장소의 Issue 흐름, 마일스톤 및 PR 협업 통계를 확인합니다."
            />
            <RepoDashboardIssueStatsSection
                data={issues.data}
                loading={issues.isLoading}
                error={issues.error?.message}
                onRetry={() => {
                    void issues.refetch();
                }}
                popular={
                    <RepoDashboardPopularIssueList
                        embedded
                        data={popular.data}
                        loading={popular.isLoading}
                        error={popular.isError}
                        onRetry={() => {
                            void popular.refetch();
                        }}
                    />
                }
            />
            <RepoDashboardPullRequestStatsSection
                data={pulls.data}
                loading={pulls.isLoading}
                error={pulls.error?.message}
                onRetry={() => {
                    void pulls.refetch();
                }}
            />
        </section>
    );
}
