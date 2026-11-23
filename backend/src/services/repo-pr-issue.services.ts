import GithubRepoPrIssueClient, {
    repoPrIssueCollectionLimitMs,
} from "../client/repo-pr-issue.client";
import RepoCommitStatusProcessor from "../processor/repo-commit-status.processor";
import type {
    DashboardPeriod,
    GetRepoIssueStatsData,
    GetRepoPullRequestStatsData,
    Metric,
} from "../types/controllers/repo-pr-issue";
import { issueStats, percent } from "../utils/repo-pr-issue";
import { collectPullDetails } from "./repo-pull-request.collection";
import {
    chooseMilestones,
    collectCohort,
    summarizeMilestone,
    summarizePullDetails,
    summarizePullOverview,
} from "../processor/repo-pr-issue.processor";

export default class RepoPrIssueServices {
    private readonly client: GithubRepoPrIssueClient;
    private readonly basis: DashboardPeriod;
    private readonly deadline = Date.now() + repoPrIssueCollectionLimitMs;

    constructor(
        owner: string,
        repo: string,
        timezone: string,
        private readonly token?: string,
        private readonly publicOnly = false,
    ) {
        this.client = new GithubRepoPrIssueClient(owner, repo, token);
        const asOf = new Date().toISOString();
        const today = RepoCommitStatusProcessor.localParts(asOf, timezone).date;
        const { from, to } = RepoCommitStatusProcessor.daysPeriod(today, 28, timezone);
        this.basis = { asOf, timezone, period: { from, to } };
    }

    private complete<T>(value: T): Metric<T> {
        return { status: "complete", value };
    }

    private partial<T>(reason = "모든 페이지를 수집하지 못했습니다."): Metric<T> {
        return { status: "partial", value: null, reason };
    }

    private unavailable<T>(reason: string): Metric<T> {
        return { status: "unavailable", value: null, reason };
    }

    public async issues(): Promise<GetRepoIssueStatsData> {
        if (this.publicOnly) await this.client.verifyPublicRepository();
        const [issues, milestones] = await Promise.all([
            this.client.issueStatsPages(),
            this.getMilestones().catch(() =>
                this.unavailable<NonNullable<GetRepoIssueStatsData["milestones"]["value"]>>(
                    "마일스톤을 조회할 수 없습니다.",
                ),
            ),
        ]);
        return {
            ...this.basis,
            stats: issues.complete
                ? this.complete(issueStats(issues.items, this.basis))
                : this.partial(),
            milestones,
        };
    }

    private async getMilestones(): Promise<GetRepoIssueStatsData["milestones"]> {
        const { complete, items } = await this.client.milestones();
        if (!complete) return this.partial();
        const chosen = chooseMilestones(items);
        const rows = await Promise.allSettled(
            chosen.map(async (item) => {
                const source = await this.client.issues(item.number);
                if (!source.complete) return null;
                return summarizeMilestone(item, source.items);
            }),
        );
        const known = rows.flatMap((row) =>
            row.status === "fulfilled" && row.value ? [row.value] : [],
        );
        return known.length === chosen.length ? this.complete(known) : this.partial();
    }

    public async pullRequests(): Promise<GetRepoPullRequestStatsData> {
        if (this.publicOnly) await this.client.verifyPublicRepository();
        const { from } = this.basis.period;
        const fromTime = Date.parse(from);

        // 최근 표본과 현재 열린 PR을 별도로 수집해 전체 이력을 훑느라 최근 분석이 지연되지 않게 합니다.
        const recent = this.token ? this.client.pulls("all", fromTime) : this.client.pulls();
        const opened = this.token ? this.client.pulls("open") : recent;
        const total = this.token
            ? this.client.pullTotals()
            : recent.then(({ items, complete }) => {
                  if (!complete) return null;
                  const merged = items.filter((pull) => pull.merged_at).length;
                  return {
                      open: items.filter((pull) => pull.state === "open").length,
                      merged,
                      closedUnmerged:
                          items.filter((pull) => pull.state === "closed").length - merged,
                  };
              });

        const [recentResult, openResult, totalResult] = await Promise.allSettled([
            recent,
            opened,
            total,
        ]);
        if (recentResult.status === "rejected") throw recentResult.reason;
        const { items, complete } = recentResult.value;
        const open =
            openResult.status === "fulfilled" && openResult.value.complete
                ? openResult.value.items.filter((pull) => pull.state === "open")
                : null;
        const draftCount = open?.filter((pull) => pull.draft).length ?? 0;
        const cohort = collectCohort(items, this.basis.period);
        const cohortComplete =
            complete || items.some((pull) => Date.parse(pull.created_at) < fromTime);
        const stats: GetRepoPullRequestStatsData = {
            ...this.basis,
            totals:
                totalResult.status === "fulfilled" && totalResult.value
                    ? this.complete(totalResult.value)
                    : this.partial(),
            draft: open
                ? this.complete({
                      count: draftCount,
                      total: open.length,
                      percent: percent(draftCount, open.length),
                  })
                : this.partial(),
            overview: cohortComplete
                ? this.complete(summarizePullOverview(cohort))
                : this.partial(),
            firstReview: this.partial(),
            sizeStats: this.partial(),
            collaboration: this.partial(),
            linkedIssues: this.token
                ? this.partial()
                : this.unavailable("Issue 연결은 GitHub 인증 후 조회할 수 있습니다."),
        };
        if (!cohortComplete) return stats;

        const details = await collectPullDetails(this.client, cohort, this.deadline);
        if (details.length !== cohort.length) return stats;
        return { ...stats, ...summarizePullDetails(details, stats) };
    }
}
