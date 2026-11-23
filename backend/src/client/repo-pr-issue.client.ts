import { Octokit } from "@octokit/rest";
import { repoIssueStatsPageQuery } from "./queries/github/repo-issue-stats-page.query";
import type { IssueInput } from "../utils/repo-pr-issue";
import { GithubGQLIssueState } from "../types/github/graphql/operations.generated";
import { GithubGraphqlFetch } from "../client/repo.client";
import { repoPullClosingIssuesQuery } from "../client/queries/github/repo-pull-closing-issues.query";
import { repoPullTotalsQuery } from "../client/queries/github/repo-pull-totals.query";
import type {
    GithubGQLGetRepoPullClosingIssuesQuery,
    GithubGQLGetRepoPullTotalsQuery,
    GithubGQLGetRepoIssueStatsPageQuery,
} from "../types/github/graphql/operations.generated";
import type {
    RestConversation,
    RestIssue,
    RestMilestone,
    RestPull,
    RestPullDetail,
    RestReview,
    RestReviewComment,
} from "../types/github/rest/repo-pr-issue";

type Page<T> = { data: T[]; headers: { link?: string } };
export const repoPrIssueCollectionLimitMs = 40000;

export type Collected<T> = { items: T[]; complete: boolean };

export default class GithubRepoPrIssueClient {
    private readonly api: Octokit;
    private readonly repository: { owner: string; repo: string };
    private readonly deadline = Date.now() + repoPrIssueCollectionLimitMs;

    constructor(
        owner: string,
        repo: string,
        private readonly token?: string,
    ) {
        this.repository = { owner, repo };
        this.api = new Octokit({ auth: token, request: { timeout: 5000 } });
    }

    private async collect<T>(
        fetchPage: (page: number) => Promise<Page<T>>,
        maxPages: number,
        isLastPage?: (items: T[]) => boolean,
    ) {
        const items: T[] = [];
        for (let page = 1; page <= maxPages && Date.now() < this.deadline; page++) {
            const response = await fetchPage(page);
            items.push(...response.data);
            if (isLastPage?.(response.data) || !response.headers.link?.includes('rel="next"'))
                return { items, complete: true };
        }
        return { items, complete: false };
    }

    public async verifyPublicRepository() {
        const { data: repository } = await this.api.rest.repos.get(this.repository);
        if (repository.private || repository.visibility === "internal") {
            throw Object.assign(new Error("저장소를 찾을 수 없습니다."), { status: 404 });
        }
    }

    public issues(milestone?: number): Promise<Collected<RestIssue>> {
        return this.collect(
            (page) =>
                this.api.rest.issues.listForRepo({
                    ...this.repository,
                    state: "all",
                    sort: "created",
                    direction: "desc",
                    page,
                    per_page: 100,
                    ...(milestone === undefined ? {} : { milestone: String(milestone) }),
                }),
            60,
        );
    }

    public async issueStatsPages(): Promise<Collected<IssueInput>> {
        if (!this.token) return this.issues();
        const [open, closed] = await Promise.all([
            this.issueStatsPagesByState(GithubGQLIssueState.Open),
            this.issueStatsPagesByState(GithubGQLIssueState.Closed),
        ]);
        return {
            items: [...open.items, ...closed.items],
            complete: open.complete && closed.complete,
        };
    }

    private async issueStatsPagesByState(
        state: GithubGQLIssueState,
    ): Promise<Collected<IssueInput>> {
        const { owner, repo } = this.repository;
        const items: IssueInput[] = [];
        let after: string | undefined;
        for (let page = 0; page < 60 && Date.now() < this.deadline; page++) {
            const response: GithubGQLGetRepoIssueStatsPageQuery = await GithubGraphqlFetch(
                this.token,
                repoIssueStatsPageQuery,
                { owner, repo, state, after },
            );
            const connection = response.repository?.issues;
            if (!connection)
                throw Object.assign(new Error("저장소를 찾을 수 없습니다."), { status: 404 });
            for (const issue of connection.nodes ?? []) {
                if (
                    !issue ||
                    (state === GithubGQLIssueState.Open && issue.labels?.pageInfo.hasNextPage)
                )
                    return { items, complete: false };
                items.push({
                    state: issue.state.toLowerCase(),
                    state_reason: issue.stateReason?.toLowerCase(),
                    created_at: issue.createdAt,
                    closed_at: issue.closedAt ?? null,
                    comments: issue.comments.totalCount,
                    assignee: issue.assignees.totalCount > 0,
                    labels:
                        issue.labels?.nodes?.flatMap((label) => (label ? [label.name] : [])) ?? [],
                    type: issue.issueType,
                });
            }
            if (!connection.pageInfo.hasNextPage) return { items, complete: true };
            if (!connection.pageInfo.endCursor) break;
            after = connection.pageInfo.endCursor;
        }
        return { items, complete: false };
    }

    public milestones(): Promise<Collected<RestMilestone>> {
        return this.collect(
            (page) =>
                this.api.rest.issues.listMilestones({
                    ...this.repository,
                    state: "open",
                    sort: "due_on",
                    direction: "asc",
                    page,
                    per_page: 100,
                }),
            10,
        );
    }

    public pulls(state: "open" | "all" = "all", since?: number): Promise<Collected<RestPull>> {
        return this.collect<RestPull>(
            (page) =>
                this.api.rest.pulls.list({
                    ...this.repository,
                    state,
                    sort: "created",
                    direction: "desc",
                    page,
                    per_page: 100,
                }),
            60,
            since === undefined
                ? undefined
                : (items) => items.some((pull) => Date.parse(pull.created_at) < since),
        );
    }

    public async pullTotals() {
        const { owner, repo } = this.repository;
        const response = await GithubGraphqlFetch<GithubGQLGetRepoPullTotalsQuery>(
            this.token,
            repoPullTotalsQuery,
            { owner, repo },
        );
        const totals = response.repository;
        if (!totals) throw Object.assign(new Error("저장소를 찾을 수 없습니다."), { status: 404 });
        return {
            open: totals.open.totalCount,
            merged: totals.merged.totalCount,
            closedUnmerged: totals.closed.totalCount,
        };
    }

    public async pull(number: number): Promise<RestPullDetail> {
        const { data: response } = await this.api.rest.pulls.get({
            ...this.repository,
            pull_number: number,
        });
        return response;
    }

    public reviews(number: number): Promise<Collected<RestReview>> {
        return this.collect(
            (page) =>
                this.api.rest.pulls.listReviews({
                    ...this.repository,
                    pull_number: number,
                    page,
                    per_page: 100,
                }),
            10,
        );
    }

    public conversation(number: number): Promise<Collected<RestConversation>> {
        return this.collect(
            (page) =>
                this.api.rest.issues.listComments({
                    ...this.repository,
                    issue_number: number,
                    page,
                    per_page: 100,
                }),
            10,
        );
    }

    public reviewComments(number: number): Promise<Collected<RestReviewComment>> {
        return this.collect(
            (page) =>
                this.api.rest.pulls.listReviewComments({
                    ...this.repository,
                    pull_number: number,
                    page,
                    per_page: 100,
                }),
            10,
        );
    }

    public async closingIssues(number: number): Promise<Collected<string>> {
        const items: string[] = [];
        const { owner, repo } = this.repository;
        if (!this.token) return { items, complete: false };
        let after: string | undefined;
        for (let page = 0; page < 10 && Date.now() < this.deadline; page++) {
            const response: GithubGQLGetRepoPullClosingIssuesQuery = await GithubGraphqlFetch(
                this.token,
                repoPullClosingIssuesQuery,
                { owner, repo, number, after },
            );
            const connection = response.repository?.pullRequest?.closingIssuesReferences;
            if (!connection) break;
            for (const issue of connection.nodes ?? []) {
                if (
                    issue?.repository.nameWithOwner.toLowerCase() ===
                    (owner + "/" + repo).toLowerCase()
                ) {
                    items.push(issue.id);
                }
            }
            if (!connection.pageInfo.hasNextPage) return { items, complete: true };
            if (!connection.pageInfo.endCursor) break;
            after = connection.pageInfo.endCursor;
        }
        return { items, complete: false };
    }
}
