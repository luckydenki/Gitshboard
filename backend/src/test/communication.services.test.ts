import { describe, it, expect, vi, beforeEach } from "vitest";
const client = vi.hoisted(() => ({
    repository: vi.fn(),
    contributors: vi.fn(),
    issues: vi.fn(),
    releases: vi.fn(),
    discussions: vi.fn(),
    comments: vi.fn(),
}));
vi.mock("../client/repo-communication.client", () => ({
    default: class {
        constructor() {
            return client;
        }
    },
}));
import RepoCommunicationServices from "../services/repo-communication.services";
beforeEach(() => vi.resetAllMocks());
describe("communication services", () => {
    it("includes anonymous contributions in share denominator", async () => {
        client.contributors.mockResolvedValue({
            data: [
                { login: "a", contributions: 3, avatar_url: "avatar", html_url: "url" },
                { contributions: 1 },
            ],
            headers: {},
        });
        const r = await new RepoCommunicationServices("owner", "repo").get("contributors");
        expect(r.contributors?.value?.top[0]?.sharePercent).toBe(75);
        expect(r.contributors?.value?.totalEntries).toBe(2);
    });
    it("excludes PRs from open issue labels and returns null for empty denominator", async () => {
        client.issues.mockResolvedValue({
            data: [{ pull_request: {}, labels: ["good first issue"] }],
            headers: {},
        });
        const r = await new RepoCommunicationServices("owner", "repo").get("onboarding");
        expect(r.openIssues?.value).toEqual({
            total: 0,
            goodFirstIssueCount: 0,
            helpWantedCount: 0,
            assignedPercent: null,
        });
    });
    it("rejects private repositories when using server public token", async () => {
        client.repository.mockResolvedValue({ data: { private: true } });
        await expect(
            new RepoCommunicationServices("o", "r", "token", true).get("contributors"),
        ).rejects.toMatchObject({ status: 404 });
        expect(client.contributors).not.toHaveBeenCalled();
    });
    it("distinguishes disabled discussions from empty results", async () => {
        client.discussions.mockResolvedValue({ repository: { hasDiscussionsEnabled: false } });
        const r = await new RepoCommunicationServices("o", "r", "token").get("discussions");
        expect(r.distribution).toMatchObject({
            status: "unavailable",
            reason: "disabled",
            value: null,
        });
    });
    it("does not publish partial discussion ranks", async () => {
        client.discussions.mockResolvedValue({
            repository: {
                hasDiscussionsEnabled: true,
                discussionCategories: { nodes: [{ id: "cat", name: "Q&A", isAnswerable: true }] },
                discussions: {
                    nodes: [
                        {
                            id: "d",
                            number: 1,
                            title: "title",
                            url: "url",
                            createdAt: new Date(Date.now() - 86400000).toISOString(),
                            author: { id: "a" },
                            upvoteCount: 3,
                            category: { id: "cat", name: "Q&A", isAnswerable: true },
                            answer: null,
                            comments: { totalCount: 1 },
                        },
                    ],
                    pageInfo: { hasNextPage: false },
                },
            },
        });
        client.comments.mockRejectedValue(new Error("failed"));
        const r = await new RepoCommunicationServices("o", "r", "token").get("discussions");
        expect(r.distribution?.status).toBe("complete");
        expect(r.popular).toMatchObject({ status: "partial", value: null });
    });
});
