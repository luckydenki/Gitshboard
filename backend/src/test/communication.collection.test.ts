import { describe, it, expect, vi } from "vitest";
import RepoCommunicationCollection from "../services/repo-communication.collection";
import type GithubRepoCommunicationClient from "../client/repo-communication.client";
const fake = (methods: object) => methods as GithubRepoCommunicationClient;
describe("communication collection", () => {
    it("collects comment and reply cursors while skipping empty reply lists", async () => {
        const comments = vi
            .fn()
            .mockResolvedValueOnce({
                node: {
                    comments: {
                        nodes: [
                            {
                                id: "c",
                                createdAt: "date",
                                author: null,
                                replies: { totalCount: 1 },
                            },
                        ],
                        pageInfo: { hasNextPage: true, endCursor: "next" },
                    },
                },
            })
            .mockResolvedValueOnce({
                node: {
                    replies: {
                        nodes: [{ id: "r", createdAt: "date", author: null }],
                        pageInfo: { hasNextPage: false },
                    },
                },
            })
            .mockResolvedValueOnce({
                node: {
                    comments: {
                        nodes: [
                            {
                                id: "empty",
                                createdAt: "date",
                                author: null,
                                replies: { totalCount: 0 },
                            },
                        ],
                        pageInfo: { hasNextPage: false },
                    },
                },
            });
        const rows = await new RepoCommunicationCollection(
            fake({ comments }),
            Date.now() + 40000,
        ).comments("discussion");
        expect(rows.map((r) => r.id)).toEqual(["c", "r", "empty"]);
        expect(comments.mock.calls).toEqual([
            ["discussion", undefined],
            ["c", undefined],
            ["discussion", "next"],
        ]);
    });
    it("shares the original deadline and makes no calls after expiration", async () => {
        const comments = vi.fn(),
            discussions = vi.fn();
        const c = new RepoCommunicationCollection(fake({ comments, discussions }), Date.now() - 1);
        await expect(c.comments("id")).rejects.toThrow("collection_limit");
        expect((await c.discussions()).complete).toBe(false);
        expect(comments).not.toHaveBeenCalled();
        expect(discussions).not.toHaveBeenCalled();
    });
    it("caps discussion pagination at sixty pages", async () => {
        const discussions = vi
            .fn()
            .mockResolvedValue({
                repository: {
                    hasDiscussionsEnabled: true,
                    discussionCategories: { nodes: [] },
                    discussions: { nodes: [], pageInfo: { hasNextPage: true, endCursor: "next" } },
                },
            });
        const r = await new RepoCommunicationCollection(
            fake({ discussions }),
            Date.now() + 40000,
        ).discussions();
        expect(r.complete).toBe(false);
        expect(discussions).toHaveBeenCalledTimes(60);
    });
});
