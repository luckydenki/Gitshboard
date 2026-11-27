import { describe, it, expect } from "vitest";
import {
    activityStats,
    releaseStats,
    recentContributorPeriod,
    recentContributorStats,
} from "../utils/repo-communication";
describe("communication aggregates", () => {
    it("excludes today, counts seven dates and caps each author per day", () => {
        const comment = (id: string, createdAt: string, authorId = "other", type = "User") => ({
            id,
            createdAt,
            author: { id: authorId, __typename: type },
        });
        const result = activityStats(
            [
                comment("a", "2026-11-16T00:00:00Z"),
                comment("b", "2026-11-16T12:00:00Z"),
                comment("c", "2026-11-22T23:59:59Z"),
                comment("d", "2026-11-23T00:00:00Z"),
                comment("e", "2026-11-20T00:00:00Z", "owner"),
                comment("f", "2026-11-20T00:00:00Z", "bot", "Bot"),
            ],
            "owner",
            10,
            "2026-11-15T23:59:59Z",
            "2026-11-23T12:00:00Z",
        );
        expect(result.recentActivity).toBe(2);
        expect(result.uniqueCommenterCount).toBe(1);
        expect(result.elapsedDays).toBe(8);
        expect(result.score).toBeCloseTo(
            (0.7 * Math.log1p(10) + 0.2 * Math.log1p(2) + 0.1 * Math.log1p(1)) ** 0.9 / 10 ** 1.2,
        );
    });
    it("zero activity stays zero", () =>
        expect(
            activityStats([], null, 0, "2026-11-23T00:00:00Z", "2026-11-23T12:00:00Z").score,
        ).toBe(0));
    it("clamps calendar months and excludes draft releases", () => {
        expect(
            releaseStats(
                [
                    { draft: false, published_at: "2026-02-28T12:00:00Z" },
                    { draft: true, published_at: "2026-08-01T00:00:00Z" },
                ],
                "2026-08-31T12:00:00Z",
            ).count,
        ).toBe(1);
    });
});

describe("recent contributors", () => {
    const commit = (sha: string, date: string, id: number | null = 1) => ({
        sha,
        author:
            id === null ? null : { id, login: `user${id}`, avatar_url: "avatar", html_url: "url" },
        commit: { committer: { date } },
    });
    it("uses seven whole UTC dates excluding today", () =>
        expect(recentContributorPeriod("2026-11-24T18:00:00Z")).toEqual({
            from: "2026-11-17T00:00:00.000Z",
            to: "2026-11-24T00:00:00.000Z",
        }));
    it("filters boundaries, deduplicates SHAs, ranks authors and includes anonymous commits in shares", () => {
        const result = recentContributorStats(
            [
                commit("a", "2026-11-17T00:00:00Z"),
                commit("b", "2026-11-23T23:59:59Z"),
                commit("b", "2026-11-23T23:59:59Z"),
                commit("c", "2026-11-20T00:00:00Z", 2),
                commit("d", "2026-11-20T00:00:00Z", null),
                commit("old", "2026-11-16T23:59:59Z"),
                commit("today", "2026-11-24T00:00:00Z"),
            ],
            "2026-11-24T18:00:00Z",
        );
        expect(result.totalEntries).toBe(2);
        expect(result.top.map((c) => [c.login, c.commits, c.sharePercent])).toEqual([
            ["user1", 2, 50],
            ["user2", 1, 25],
        ]);
    });
    it("returns an empty rank for a quiet week", () =>
        expect(recentContributorStats([], "2026-11-24T00:00:00Z").top).toEqual([]));
});

it("handles commits with an empty author object as anonymous", () => {
    const result = recentContributorStats(
        [{ sha: "unknown", author: {}, commit: { committer: { date: "2026-11-20T00:00:00Z" } } }],
        "2026-11-24T00:00:00Z",
    );
    expect(result.totalEntries).toBe(0);
    expect(result.top).toEqual([]);
});
