import GithubRepoCommunicationClient from "../client/repo-communication.client";
import type {
    CommunicationMetric,
    GetRepoCommunicationData,
    CommunicationDiscussion,
} from "../types/controllers/repo-communication";
import { activityStats, releaseStats, recentContributorPeriod, recentContributorStats, type ActivityComment } from "../utils/repo-communication";
import CommonError from "../utils/common-error";
export default class RepoCommunicationServices {
    private client: GithubRepoCommunicationClient;
    private asOf = new Date().toISOString();
    private deadline = Date.now() + 40000;
    constructor(
        owner: string,
        repo: string,
        private token?: string,
        private publicOnly = false,
    ) {
        this.client = new GithubRepoCommunicationClient(owner, repo, token);
    }
    private complete<T>(value: T): CommunicationMetric<T> {
        return { status: "complete", value };
    }
    private partial<T>(): CommunicationMetric<T> {
        return { status: "partial", value: null, reason: "collection_limit" };
    }
    private async restPages<T>(
        fetch: (page: number) => Promise<{ data: T[]; headers: { link?: string } }>,
    ) {
        const items: T[] = [];
        for (let page = 1; page <= 60 && Date.now() < this.deadline; page++) {
            const r = await fetch(page);
            items.push(...(r.data ?? []));
            if (!r.headers.link?.includes('rel="next"')) return { items, complete: true };
        }
        return { items, complete: false };
    }
    public async get(endpoint: string): Promise<GetRepoCommunicationData> {
        if (this.publicOnly) {
            const { data: r } = await this.client.repository();
            if (r.private || r.visibility === "internal")
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
        }
        const data: GetRepoCommunicationData = { asOf: this.asOf };
        if (endpoint === "contributors") {
            const period = recentContributorPeriod(this.asOf);
            const result = await this.restPages((p) => this.client.commits(p, period));
            data.contributors = result.complete
                ? this.complete(recentContributorStats(result.items, this.asOf))
                : this.partial();
        } else if (endpoint === "onboarding") {
            const result = await this.restPages((p) => this.client.issues(p));
            const issues = result.items.filter((i) => !i.pull_request);
            const count = (label: string) =>
                issues.filter((i) =>
                    i.labels.some(
                        (l) => (typeof l === "string" ? l : l.name)?.toLowerCase() === label,
                    ),
                ).length;
            data.openIssues = result.complete
                ? this.complete({
                      total: issues.length,
                      goodFirstIssueCount: count("good first issue"),
                      helpWantedCount: count("help wanted"),
                      assignedPercent: issues.length
                          ? (100 * issues.filter((i) => i.assignees?.length).length) / issues.length
                          : null,
                  })
                : this.partial();
        } else if (endpoint === "releases") {
            const result = await this.restPages((p) => this.client.releases(p));
            data.releases = result.complete
                ? this.complete(releaseStats(result.items, this.asOf))
                : this.partial();
        } else await this.discussions(data);
        return data;
    }
    private async collectComments(id: string, replies = false): Promise<ActivityComment[]> {
        const items: ActivityComment[] = [];
        let after: string | undefined;
        for (let page = 0; page < 60 && Date.now() < this.deadline; page++) {
            const response = await this.client.comments(id, after);
            const node = response.node;
            const connection =
                node &&
                ("comments" in node ? node.comments : "replies" in node ? node.replies : null);
            if (!connection) throw new Error("upstream_partial");
            for (const c of connection.nodes ?? [])
                if (c) {
                    items.push(c);
                    if (
                        !replies &&
                        "replies" in c &&
                        typeof c.replies === "object" &&
                        c.replies !== null &&
                        "totalCount" in c.replies &&
                        typeof c.replies.totalCount === "number" &&
                        c.replies.totalCount > 0
                    )
                        items.push(...(await this.collectComments(c.id, true)));
                }
            if (!connection.pageInfo.hasNextPage) return items;
            after = connection.pageInfo.endCursor ?? undefined;
        }
        throw new Error("collection_limit");
    }
    private async discussions(data: GetRepoCommunicationData) {
        if (!this.token) {
            data.distribution = {
                status: "unavailable",
                value: null,
                reason: "인증이 필요합니다.",
            };
            data.responses = { status: "unavailable", value: null, reason: "인증이 필요합니다." };
            data.popular = { status: "unavailable", value: null, reason: "인증이 필요합니다." };
            return;
        }
        type Result = Awaited<ReturnType<GithubRepoCommunicationClient["discussions"]>>;
        type Discussion = NonNullable<
            NonNullable<NonNullable<Result["repository"]>["discussions"]["nodes"]>[number]
        >;
        const items: Discussion[] = [];
        let after: string | undefined;
        let complete = false;
        let categories: { id: string; name: string; isAnswerable: boolean }[] = [];
        for (let page = 0; page < 60 && Date.now() < this.deadline; page++) {
            const r = (await this.client.discussions(after)).repository;
            if (!r) throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            if (!r.hasDiscussionsEnabled) {
                const disabled = {
                    status: "unavailable" as const,
                    value: null,
                    reason: "disabled",
                };
                data.distribution = disabled;
                data.responses = disabled;
                data.popular = disabled;
                return;
            }
            categories = (r.discussionCategories.nodes ?? []).filter((c) => c !== null);
            items.push(...(r.discussions.nodes ?? []).filter((d) => d !== null));
            if (!r.discussions.pageInfo.hasNextPage) {
                complete = true;
                break;
            }
            after = r.discussions.pageInfo.endCursor ?? undefined;
        }
        if (!complete) {
            data.distribution = this.partial();
            data.responses = this.partial();
            data.popular = this.partial();
            return;
        }
        data.distribution = this.complete({
            total: items.length,
            categories: categories.map((c) => {
                const count = items.filter((d) => d.category.id === c.id).length;
                return {
                    id: c.id,
                    name: c.name,
                    count,
                    percent: items.length ? (100 * count) / items.length : null,
                };
            }),
        });
        const cohort = items.filter(
            (d) =>
                Date.parse(d.createdAt) >= Date.parse(this.asOf) - 90 * 86400000 &&
                Date.parse(d.createdAt) < Date.parse(this.asOf),
        );
        const answerable = cohort.filter((d) => d.category.isAnswerable),
            answered = answerable.filter((d) => d.answer);
        data.responses = this.complete({
            answerableCount: answerable.length,
            answeredCount: answered.length,
            answeredPercent: answerable.length ? (100 * answered.length) / answerable.length : null,
        });
        try {
            const ranked: CommunicationDiscussion[] = [];
            for (const d of cohort) {
                const comments =
                    d.comments.totalCount === 0 ? [] : await this.collectComments(d.id);
                ranked.push({
                    number: d.number,
                    title: d.title,
                    url: d.url,
                    categoryName: d.category.name,
                    topLevelCommentCount: d.comments.totalCount,
                    upvoteCount: d.upvoteCount,
                    ...activityStats(
                        comments,
                        d.author?.id ?? null,
                        d.upvoteCount,
                        d.createdAt,
                        this.asOf,
                    ),
                });
            }
            ranked.sort((a, b) => b.score - a.score || b.number - a.number);
            data.popular = this.complete(ranked.slice(0, 3));
        } catch (error) {
            const upstream = error as { status?: number; message?: string };
            data.popular =
                upstream.status === 403
                    ? { status: "unavailable", value: null, reason: "forbidden" }
                    : {
                          status: "partial",
                          value: null,
                          reason:
                              upstream.message === "collection_limit"
                                  ? "collection_limit"
                                  : "upstream_partial",
                      };
        }
    }
}
