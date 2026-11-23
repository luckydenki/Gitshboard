import { describe, expect, it } from "vitest";
import { issueStats, reviewActivity, summarizeDuration } from "../utils/repo-pr-issue";

describe("PR·Issue 집계", () => {
    it("전체 기간 종료 사유를 집계하지만 최근 종료 수에는 기간 밖 항목을 포함하지 않는다", () => {
        const base = {
            state: "closed",
            created_at: "2020-01-01T00:00:00Z",
            labels: [],
            comments: 0,
            assignees: [],
            assignee: null,
        };
        const issues = [
            { ...base, closed_at: "2020-02-01T00:00:00Z", state_reason: "duplicate" },
            { ...base, closed_at: "2026-11-20T00:00:00Z", state_reason: "completed" },
            {
                ...base,
                pull_request: {},
                closed_at: "2026-11-20T00:00:00Z",
                state_reason: "completed",
            },
        ];
        const result = issueStats(issues, {
            asOf: "2026-11-23T00:00:00Z",
            timezone: "UTC",
            period: { from: "2026-10-26T00:00:00Z", to: "2026-11-23T00:00:00Z" },
        });
        expect(result.totals).toEqual({ open: 0, closed: 2, total: 2 });
        expect(result.flow.closed).toBe(1);
        expect(result.closeReasons.map((row) => [row.label, row.count])).toEqual([
            ["완료", 1],
            ["중복", 1],
        ]);
    });
    it("일반 댓글과 코드 댓글을 함께 세고 봇과 미제출 리뷰를 제외한다", () => {
        const user = { id: 1, type: "User" };
        const reviewer = { id: 2, type: "User" };
        const bot = { id: 3, type: "Bot" };
        expect(
            reviewActivity(
                user,
                [
                    { user: reviewer, submitted_at: "2026-11-21T00:00:00Z", state: "APPROVED" },
                    { user: bot, submitted_at: "2026-11-20T00:00:00Z", state: "COMMENTED" },
                    { user, state: "PENDING" },
                ],
                [{ user }, { user: bot }],
                [{ user: reviewer }, { user: bot }],
            ),
        ).toEqual({
            reviews: 1,
            comments: 2,
            participants: 2,
            missingAuthors: false,
            firstReviewAt: "2026-11-21T00:00:00Z",
        });
    });
    it("표본이 없으면 소요 시간을 null로 두고 P90은 nearest rank로 계산한다", () => {
        expect(summarizeDuration([])).toEqual({
            samples: 0,
            medianSeconds: null,
            p90Seconds: null,
        });
        expect(summarizeDuration([4, 1, 2, 3])).toEqual({
            samples: 4,
            medianSeconds: 2.5,
            p90Seconds: 4,
        });
    });
});
