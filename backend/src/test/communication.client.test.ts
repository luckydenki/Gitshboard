import { describe, it, expect, vi, beforeEach } from "vitest";
const rest = vi.hoisted(() => ({ listCommits: vi.fn() }));
vi.mock("@octokit/rest", () => ({
    Octokit: class {
        rest = { repos: rest };
    },
}));
vi.mock("../client/repo.client", () => ({ GithubGraphqlFetch: vi.fn() }));
import GithubRepoCommunicationClient from "../client/repo-communication.client";
beforeEach(() => vi.resetAllMocks());
describe("weekly contributor commit request", () => {
    const period = { from: "2026-11-17T00:00:00.000Z", to: "2026-11-24T00:00:00.000Z" };
    it("bounds each request and uses the default branch", async () => {
        rest.listCommits.mockResolvedValue({ data: [], headers: {} });
        await new GithubRepoCommunicationClient("owner", "repo").commits(2, period);
        expect(rest.listCommits).toHaveBeenCalledWith({
            owner: "owner",
            repo: "repo",
            per_page: 100,
            page: 2,
            since: "2026-11-16T23:59:59.000Z",
            until: "2026-11-23T23:59:59.000Z",
        });
    });
    it("recognizes only the explicit empty-repository conflict as empty", async () => {
        rest.listCommits.mockRejectedValue({ status: 409, message: "Git Repository is empty." });
        await expect(
            new GithubRepoCommunicationClient("owner", "repo").commits(1, period),
        ).resolves.toEqual({ data: [], headers: {} });
    });
    it("propagates access and rate failures", async () => {
        rest.listCommits.mockRejectedValue({ status: 403, message: "rate limit" });
        await expect(
            new GithubRepoCommunicationClient("owner", "repo").commits(1, period),
        ).rejects.toMatchObject({ status: 403 });
    });
});
