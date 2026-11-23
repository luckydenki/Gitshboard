import RepoCommunicationCollection from "./repo-communication.collection";
import RepoCommunicationProcessor from "../processor/repo-communication.processor";
import GithubRepoCommunicationClient from "../client/repo-communication.client";
import type {
    CommunicationMetric,
    GetRepoCommunicationData,
    CommunicationDiscussion,
} from "../types/controllers/repo-communication";
import {
    activityStats,
    releaseStats,
    recentContributorPeriod,
    recentContributorStats,
} from "../utils/repo-communication";
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
        const collection = new RepoCommunicationCollection(this.client, this.deadline);
        const { items, categories, complete, disabled } = await collection.discussions();
        if (disabled) {
            const unavailable = { status: "unavailable" as const, value: null, reason: "disabled" };
            data.distribution = unavailable;
            data.responses = unavailable;
            data.popular = unavailable;
            return;
        }
        if (!complete) {
            data.distribution = this.partial();
            data.responses = this.partial();
            data.popular = this.partial();
            return;
        }
        const { distribution, responses, cohort } = RepoCommunicationProcessor.overview(
            items,
            categories,
            this.asOf,
        );
        data.distribution = this.complete(distribution);
        data.responses = this.complete(responses);
        try {
            const ranked: CommunicationDiscussion[] = [];
            for (const d of cohort) {
                const comments = d.comments.totalCount === 0 ? [] : await collection.comments(d.id);
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
            data.popular = this.complete(RepoCommunicationProcessor.rank(ranked));
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
