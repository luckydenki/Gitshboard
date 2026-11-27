import { describe, it, expect } from "vitest";
import RepoCommunicationProcessor from "../processor/repo-communication.processor";
const category = { id: "qa", name: "Q&A", isAnswerable: true };
const discussion = (number: number, createdAt = "2026-11-23T00:00:00Z") => ({
    id: String(number),
    number,
    title: "title",
    url: "url",
    createdAt,
    category,
    upvoteCount: 1,
    author: { id: "owner" },
    answer: null,
    comments: { totalCount: 0 },
});
describe("communication processor", () => {
    it("counts lifetime categories while limiting response cohort to ninety days", () => {
        const result = RepoCommunicationProcessor.overview(
            [discussion(1), discussion(2, "2026-01-01T00:00:00Z")],
            [category, { id: "empty", name: "empty", isAnswerable: false }],
            "2026-11-24T00:00:00Z",
        );
        expect(result.distribution.total).toBe(2);
        expect(result.distribution.categories[1].count).toBe(0);
        expect(result.responses).toEqual({
            answerableCount: 1,
            answeredCount: 0,
            answeredPercent: 0,
        });
        expect(result.cohort).toHaveLength(1);
    });
    it("returns null for an empty answerable denominator", () =>
        expect(
            RepoCommunicationProcessor.overview([], [], "2026-11-24T00:00:00Z").responses
                .answeredPercent,
        ).toBeNull());
    it("sorts without mutating input and resolves score ties by descending number", () => {
        const rows = [1, 4, 2, 3].map((number) => ({
            ...discussion(number),
            categoryName: "Q&A",
            topLevelCommentCount: 0,
            recentActivity: 0,
            uniqueCommenterCount: 0,
            score: 1,
            elapsedDays: 1,
        }));
        expect(RepoCommunicationProcessor.rank(rows).map((r) => r.number)).toEqual([4, 3, 2]);
        expect(rows.map((r) => r.number)).toEqual([1, 4, 2, 3]);
    });
});
