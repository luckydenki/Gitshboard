import type { CollectedPullDetails } from "../services/repo-pull-request.collection";
import type {
    GetRepoPullRequestStatsData,
    Metric,
    Period,
    PullRequestOverview,
} from "../types/controllers/repo-pr-issue";
import type { RestIssue, RestMilestone, RestPull } from "../types/github/rest/repo-pr-issue";
import {
    percent,
    pullRequestSizes,
    reviewActivity,
    summarizeDuration,
} from "../utils/repo-pr-issue";

const complete = <T>(value: T): Metric<T> => ({ status: "complete", value });

/** collectCohort — 기간의 from 이상, to 미만에 생성된 PR을 선택합니다. 빈 입력이면 빈 목록입니다. 테스트: src/test/repo-pr-issue.services.test.ts */
export function collectCohort(items: readonly RestPull[], period: Period) {
    const from = Date.parse(period.from);
    const to = Date.parse(period.to);
    return items.filter((pull) => {
        const created = Date.parse(pull.created_at);
        return created >= from && created < to;
    });
}

/** summarizePullOverview — 기간 PR의 병합 결과·시간·봇 비율을 반환합니다. 분모가 없으면 비율은 null입니다. 테스트: src/test/repo-pr-issue.services.test.ts */
export function summarizePullOverview(cohort: readonly RestPull[]): PullRequestOverview {
    const merged = cohort.filter((pull) => pull.merged_at);
    const closed = cohort.filter((pull) => pull.state === "closed" && !pull.merged_at);
    const bots = cohort.filter((pull) => pull.user?.type === "Bot").length;
    const unknown = cohort.filter((pull) => !pull.user?.type).length;
    return {
        outcomes: {
            merged: merged.length,
            closedUnmerged: closed.length,
            mergedPercent: percent(merged.length, merged.length + closed.length),
        },
        mergeTime: summarizeDuration(
            merged.map(
                (pull) => (Date.parse(pull.merged_at!) - Date.parse(pull.created_at)) / 1000,
            ),
        ),
        bots: {
            count: bots,
            unknown,
            total: cohort.length,
            percent: percent(bots, cohort.length - unknown),
        },
    };
}

/** chooseMilestones — 마감일이 빠른 마일스톤을 최대 5개 고릅니다. 미지정은 뒤에 배치합니다. 테스트: src/test/repo-pr-issue.services.test.ts */
export function chooseMilestones(items: readonly RestMilestone[]) {
    return [...items]
        .sort(
            (a, b) =>
                (a.due_on ? Date.parse(a.due_on) : Infinity) -
                    (b.due_on ? Date.parse(b.due_on) : Infinity) || a.number - b.number,
        )
        .slice(0, 5);
}

/** summarizeMilestone — 마일스톤 정보와 Issue 원본으로 진행률을 계산합니다. PR은 제외하고 빈 마일스톤은 null 비율을 가집니다. 테스트: src/test/repo-pr-issue.services.test.ts */
export function summarizeMilestone(item: RestMilestone, issues: readonly RestIssue[]) {
    const linked = issues.filter(
        (issue) => !issue.pull_request && issue.milestone?.number === item.number,
    );
    const open = linked.filter((issue) => issue.state === "open").length;
    const closed = linked.length - open;
    return {
        number: item.number,
        title: item.title,
        open,
        closed,
        percent: percent(closed, linked.length),
    };
}

type DetailMetrics = Pick<
    GetRepoPullRequestStatsData,
    "firstReview" | "sizeStats" | "collaboration" | "linkedIssues"
>;

/** summarizePullDetails — PR별 호출 결과와 기본 상태를 받아 통계를 집계합니다. 항목별 조회 누락 시 그 지표의 기본 상태를 보존합니다. 테스트: src/test/repo-pr-issue.services.test.ts */
export function summarizePullDetails(
    rows: readonly CollectedPullDetails[],
    initial: DetailMetrics,
): DetailMetrics {
    const stats: DetailMetrics = {
        firstReview: initial.firstReview,
        sizeStats: initial.sizeStats,
        collaboration: initial.collaboration,
        linkedIssues: initial.linkedIssues,
    };
    const details = [];
    const firstReviewSeconds: number[] = [];
    const referencedIssues = new Set<string>();
    let linkedPrs = 0;
    let reviewCount = 0;
    let commentCount = 0;
    let participantCount = 0;
    let collaborationComplete = true;
    let reviewComplete = true;
    let sizesComplete = true;
    let linkedComplete = true;
    for (const {
        pull,
        results: [detail, reviews, conversation, code, links],
    } of rows) {
        if (detail.status === "fulfilled") details.push(detail.value);
        else sizesComplete = false;
        if (
            reviews.status === "fulfilled" &&
            reviews.value.complete &&
            !reviews.value.items.some(
                (review) => review.state !== "PENDING" && review.submitted_at && !review.user?.type,
            )
        ) {
            const first = reviewActivity(pull.user, reviews.value.items, [], []).firstReviewAt;
            if (first)
                firstReviewSeconds.push((Date.parse(first) - Date.parse(pull.created_at)) / 1000);
        } else reviewComplete = false;

        if (
            reviews.status === "fulfilled" &&
            reviews.value.complete &&
            conversation.status === "fulfilled" &&
            conversation.value.complete &&
            code.status === "fulfilled" &&
            code.value.complete
        ) {
            const activity = reviewActivity(
                pull.user,
                reviews.value.items,
                conversation.value.items,
                code.value.items,
            );
            if (activity.missingAuthors) collaborationComplete = false;
            reviewCount += activity.reviews;
            commentCount += activity.comments;
            participantCount += activity.participants;
        } else collaborationComplete = false;

        if (links.status === "fulfilled" && links.value.complete) {
            if (links.value.items.length) linkedPrs++;
            for (const id of links.value.items) referencedIssues.add(id);
        } else linkedComplete = false;
    }
    const samples = rows.length;
    if (reviewComplete) stats.firstReview = complete(summarizeDuration(firstReviewSeconds));
    if (sizesComplete) stats.sizeStats = complete(pullRequestSizes(details));
    if (collaborationComplete)
        stats.collaboration = complete({
            samples,
            meanReviews: samples ? reviewCount / samples : null,
            meanComments: samples ? commentCount / samples : null,
            meanParticipants: samples ? participantCount / samples : null,
        });
    if (linkedComplete)
        stats.linkedIssues = complete({
            linkedPrs,
            totalPrs: samples,
            referencedIssues: referencedIssues.size,
        });
    return stats;
}
