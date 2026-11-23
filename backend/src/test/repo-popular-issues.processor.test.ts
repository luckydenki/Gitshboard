import { expect, it } from "vitest";
import { rankPopularIssues } from "../processor/repo-popular-issues.processor";

it("동점은 반응, 댓글, 번호 순으로 결정하고 최고 5개만 반환한다", () => {
    const issue = {
        title: "Issue",
        url: "https://github.com/a/b/issues/1",
        reactionCounts: {},
        lastActivityAt: "2026-11-22T00:00:00Z",
    };
    const input = [
        { ...issue, number: 3, score: 2, reactions: 4, comments: 3 },
        { ...issue, number: 2, score: 2, reactions: 4, comments: 3 },
        { ...issue, number: 4, score: 2, reactions: 4, comments: 8 },
        { ...issue, number: 5, score: 2, reactions: 6, comments: 0 },
        { ...issue, number: 6, score: 3, reactions: 0, comments: 0 },
        { ...issue, number: 7, score: 1, reactions: 0, comments: 0 },
    ];
    expect(rankPopularIssues(input).map((row) => row.number)).toEqual([6, 5, 4, 2, 3]);
    expect(input[0].number).toBe(3);
    expect(rankPopularIssues([])).toEqual([]);
});
