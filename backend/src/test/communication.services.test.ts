import { describe, it, expect, vi, beforeEach } from "vitest";
const client = vi.hoisted(() => ({
    repository: vi.fn(),
    commits: vi.fn(),
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
    it("requests only commits in the seven day window", async () => {
        client.commits.mockResolvedValue({ data: [], headers: {} });
        const r = await new RepoCommunicationServices("owner", "repo").get("contributors");
        const period = r.contributors?.value?.period;
        expect(client.commits).toHaveBeenCalledWith(1, period);
        expect(Date.parse(period!.to) - Date.parse(period!.from)).toBe(7 * 86400000);
        expect(r.contributors?.value?.top).toEqual([]);
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
        expect(client.commits).not.toHaveBeenCalled();
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
