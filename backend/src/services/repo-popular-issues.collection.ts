import type GithubRepoPopularIssuesClient from "../client/repo-popular-issues.client";
import { repoPrIssueCollectionLimitMs } from "../client/repo-pr-issue.client";
import type { GetRepoPopularIssuesData } from "../types/controllers/repo-popular-issues";
import type { RestIssue } from "../types/github/rest/repo-pr-issue";
import { issuePopularityScore } from "../utils/issue-popularity";
import { rankPopularIssues } from "../processor/repo-popular-issues.processor";

const reactionNames = {
    THUMBS_UP: "+1",
    THUMBS_DOWN: "-1",
    LAUGH: "laugh",
    CONFUSED: "confused",
    HEART: "heart",
    HOORAY: "hooray",
    ROCKET: "rocket",
    EYES: "eyes",
} as const;

/** 인증된 GitHub 요청에서 인기 순위를 매길 수 있는 열린 Issue 페이지를 수집합니다. */
export async function collectGraphqlPopularIssues(
    client: GithubRepoPopularIssuesClient,
    token: string,
    asOf: Date,
): Promise<GetRepoPopularIssuesData> {
    const deadline = asOf.getTime() + repoPrIssueCollectionLimitMs;
    const all = new Map<number, NonNullable<GetRepoPopularIssuesData["issues"]>[number]>();
    const partial: GetRepoPopularIssuesData = {
        asOf: asOf.toISOString(),
        status: "partial",
        reason: "열린 Issue의 반응을 모두 확인하지 못했습니다.",
        issues: null,
    };
    let after: string | undefined;
    for (let page = 0; page < 60 && Date.now() < deadline; page++) {
        const response = await client.graphqlPage(token, after);
        const connection = response.repository?.issues;
        if (!connection)
            throw Object.assign(new Error("저장소를 찾을 수 없습니다."), { status: 404 });
        for (const item of connection.nodes ?? []) {
            if (!item) return partial;
            const reactionCounts: Record<string, number> = Object.fromEntries(
                Object.values(reactionNames).map((name) => [name, 0]),
            );
            for (const reaction of item.reactionGroups ?? [])
                reactionCounts[reactionNames[reaction.content]] = reaction.reactors.totalCount;
            const reactions = item.reactions.totalCount;
            const latestReactionAt = item.reactions.nodes?.[0]?.createdAt;
            if (
                (reactions && !latestReactionAt) ||
                Object.values(reactionCounts).reduce((sum, count) => sum + count, 0) !== reactions
            )
                return partial;
            const last = Math.max(
                Date.parse(item.updatedAt),
                latestReactionAt ? Date.parse(latestReactionAt) : -Infinity,
            );
            all.set(item.number, {
                number: item.number,
                title: item.title,
                url: item.url,
                comments: item.comments.totalCount,
                reactions,
                reactionCounts,
                lastActivityAt: new Date(last).toISOString(),
                score: issuePopularityScore(
                    item.comments.totalCount,
                    reactions,
                    Math.max(0, (asOf.getTime() - last) / 86400000),
                ),
            });
        }
        if (!connection.pageInfo.hasNextPage) {
            return {
                asOf: asOf.toISOString(),
                status: "complete",
                reason: null,
                issues: rankPopularIssues([...all.values()]),
            };
        }
        if (!connection.pageInfo.endCursor) break;
        after = connection.pageInfo.endCursor;
    }
    return partial;
}

/** 익명 REST 호출의 페이지 제한과 점수가 낮은 후보의 조기 종료를 관리합니다. */
export async function collectRestPopularIssues(
    client: GithubRepoPopularIssuesClient,
    asOf: Date,
): Promise<GetRepoPopularIssuesData> {
    let issues: NonNullable<GetRepoPopularIssuesData["issues"]> = [];
    const deadline = asOf.getTime() + repoPrIssueCollectionLimitMs;
    let partial = false;
    const candidates = new Map<number, RestIssue>();
    for (let page = 1; page <= 60; page++) {
        if (Date.now() >= deadline) {
            partial = true;
            break;
        }
        const { data: response, headers } = await client.openIssues(page);
        for (const issue of response) if (!issue.pull_request) candidates.set(issue.number, issue);
        const hasNext = headers?.link
            ? headers.link.includes('rel="next"')
            : response.length === 100;
        if (!hasNext) break;
        if (page === 60) partial = true;
    }
    const rankedCandidates = [...candidates.values()]
        .map((issue) => ({
            issue,
            // 경과일이 0일 때가 최대 점수입니다. 후보가 상위 5개에 들 수 없으면 상세를 조회하지 않습니다.
            upper: issue.reactions
                ? issuePopularityScore(issue.comments, issue.reactions.total_count, 0)
                : Infinity,
        }))
        .sort((a, b) => b.upper - a.upper || a.issue.number - b.issue.number);
    for (const { issue, upper } of rankedCandidates) {
        if (partial) break;
        if (issues.length === 5 && upper < issues[4].score) break;
        if (Date.now() >= deadline) {
            partial = true;
            break;
        }
        let lastActivity = Date.parse(issue.updated_at);
        const reactionCounts: Record<string, number> = {
            "+1": 0,
            "-1": 0,
            laugh: 0,
            confused: 0,
            heart: 0,
            hooray: 0,
            rocket: 0,
            eyes: 0,
        };
        let reactionCount = 0;
        const expected = issue.reactions?.total_count;
        let reactionsComplete = expected === 0;
        for (let page = 1; !reactionsComplete && page <= 10 && Date.now() < deadline; page++) {
            const { data: reaction_response, headers } = await client.reactions(issue.number, page);
            reactionCount += reaction_response.length;
            for (const reaction of reaction_response) {
                reactionCounts[reaction.content] = (reactionCounts[reaction.content] ?? 0) + 1;
                lastActivity = Math.max(lastActivity, Date.parse(reaction.created_at));
            }
            const hasNext = headers?.link
                ? headers.link.includes('rel="next"')
                : reaction_response.length === 100;
            reactionsComplete = !hasNext;
        }
        if (!reactionsComplete || (expected !== undefined && expected !== reactionCount)) {
            partial = true;
            break;
        }
        issues.push({
            number: issue.number,
            title: issue.title,
            url: issue.html_url,
            comments: issue.comments,
            reactions: reactionCount,
            reactionCounts,
            lastActivityAt: new Date(lastActivity).toISOString(),
            score: issuePopularityScore(
                issue.comments,
                reactionCount,
                Math.max(0, (asOf.getTime() - lastActivity) / 86400000),
            ),
        });
        issues = rankPopularIssues(issues);
    }
    return {
        asOf: asOf.toISOString(),
        status: partial ? "partial" : "complete",
        reason: partial ? "조회 제한 또는 수집 중 데이터 변경" : null,
        issues: partial ? null : issues.slice(0, 5),
    };
}
