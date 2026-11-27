import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const github = vi.hoisted(() => ({
    verifyPublicRepository: vi.fn(),
    issues: vi.fn(),
    milestones: vi.fn(),
    pulls: vi.fn(),
    pullTotals: vi.fn(),
    pull: vi.fn(),
    reviews: vi.fn(),
    conversation: vi.fn(),
    reviewComments: vi.fn(),
    closingIssues: vi.fn(),
}));

vi.mock("../client/repo-pr-issue.client", () => ({
    repoPrIssueCollectionLimitMs: 40000,
    default: class {
        verifyPublicRepository = github.verifyPublicRepository;
        issues = github.issues;
        issueStatsPages = github.issues;
        milestones = github.milestones;
        pulls = github.pulls;
        pullTotals = github.pullTotals;
        pull = github.pull;
        reviews = github.reviews;
        conversation = github.conversation;
        reviewComments = github.reviewComments;
        closingIssues = github.closingIssues;
    },
}));

import RepoPrIssueServices from "../services/repo-pr-issue.services";

describe("PR·Issue API 서비스", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date("2026-11-23T12:00:00Z"));
    });
    afterEach(() => vi.useRealTimers());

    it("마일스톤을 마감일 순으로 5개만 반환하고 연결 PR은 진행률에서 제외한다", async () => {
        const milestones = Array.from({ length: 6 }, (_item, i) => ({
            number: i + 1,
            title: `마일스톤 ${i + 1}`,
            due_on: i === 0 ? null : `2026-12-0${7 - i}T00:00:00Z`,
        }));
        github.milestones.mockResolvedValue({ complete: true, items: milestones });
        const base = {
            state: "closed",
            created_at: "2026-10-01T00:00:00Z",
            closed_at: "2026-11-01T00:00:00Z",
            labels: [],
            comments: 0,
        };
        github.issues.mockResolvedValue({
            complete: true,
            items: [
                { ...base, milestone: { number: 6 } },
                { ...base, state: "open", milestone: { number: 6 } },
                { ...base, milestone: { number: 6 }, pull_request: {} },
            ],
        });
        const result = await new RepoPrIssueServices("owner", "repo", "UTC").issues();
        expect(result.milestones.status).toBe("complete");
        expect(result.milestones.value?.map((row) => row.number)).toEqual([6, 5, 4, 3, 2]);
        expect(result.milestones.value?.[0]).toMatchObject({ open: 1, closed: 1, percent: 50 });
    });

    it("대상 기간 PR의 협업과 크기 및 연결을 집계하고 오래된 PR은 상세 조회하지 않는다", async () => {
        const user = { id: 1, type: "User" };
        const bot = { id: 2, type: "Bot" };
        const pull = {
            number: 5,
            state: "closed",
            created_at: "2026-11-20T00:00:00Z",
            merged_at: "2026-11-21T00:00:00Z",
            user,
            draft: false,
        };
        github.pulls.mockResolvedValue({
            complete: true,
            items: [pull, { ...pull, number: 3, created_at: "2026-10-01T00:00:00Z" }],
        });
        github.pullTotals.mockResolvedValue({ open: 0, merged: 2, closedUnmerged: 0 });
        github.pull.mockResolvedValue({ ...pull, additions: 50, deletions: 51, changed_files: 3 });
        github.reviews.mockResolvedValue({
            complete: true,
            items: [
                { user, state: "APPROVED", submitted_at: "2026-11-20T01:00:00Z" },
                { user: bot, state: "COMMENTED", submitted_at: "2026-11-20T00:30:00Z" },
            ],
        });
        github.conversation.mockResolvedValue({ complete: true, items: [{ user }, { user: bot }] });
        github.reviewComments.mockResolvedValue({
            complete: true,
            items: [{ user }, { user: bot }],
        });
        github.closingIssues.mockResolvedValue({ complete: true, items: ["issue-1", "issue-1"] });

        const result = await new RepoPrIssueServices(
            "owner",
            "repo",
            "UTC",
            "token",
        ).pullRequests();
        expect(github.pull).toHaveBeenCalledExactlyOnceWith(5);
        expect(result.collaboration.value).toEqual({
            samples: 1,
            meanReviews: 1,
            meanComments: 2,
            meanParticipants: 1,
        });
        expect(result.firstReview.value?.medianSeconds).toBe(3600);
        expect(result.sizeStats.value?.sizes[1]).toMatchObject({ count: 1, percent: 100 });
        expect(result.linkedIssues.value).toEqual({
            linkedPrs: 1,
            totalPrs: 1,
            referencedIssues: 1,
        });
        github.reviewComments.mockResolvedValue({ complete: false, items: [] });
        const partial = await new RepoPrIssueServices(
            "owner",
            "repo",
            "UTC",
            "token",
        ).pullRequests();
        expect(partial.collaboration).toMatchObject({ status: "partial", value: null });
        expect(partial.firstReview.status).toBe("complete");
    });
});
