import { describe, expect, it } from "vitest";
import { issuePopularityScore } from "../utils/issue-popularity";

describe("issuePopularityScore", () => {
    it("댓글 60%, 모든 반응 40%와 경과 일수 + 2를 적용한다", () => {
        expect(issuePopularityScore(10, 5, 3)).toBeCloseTo(Math.pow(8, 0.8) / Math.pow(5, 1.2));
    });
    it("활동 직후에도 0으로 나누지 않는다", () => {
        expect(issuePopularityScore(1, 0, 0)).toBeCloseTo(Math.pow(0.6, 0.8) / Math.pow(2, 1.2));
    });
    it("관심이 없는 이슈는 0점이고 시간이 지나면 점수가 낮아진다", () => {
        expect(issuePopularityScore(0, 0, 0)).toBe(0);
        expect(issuePopularityScore(10, 5, 10)).toBeLessThan(issuePopularityScore(10, 5, 1));
    });
});
