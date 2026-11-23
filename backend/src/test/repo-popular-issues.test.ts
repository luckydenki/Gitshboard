import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { AuthRequest } from "../types/middlewares/auth";
import type { Response } from "express";
const api = vi.hoisted(() => ({ issues: vi.fn(), reactions: vi.fn(), repo: vi.fn() }));
vi.mock("@octokit/rest", () => ({
    Octokit: class {
        rest = {
            issues: { listForRepo: api.issues },
            reactions: { listForIssue: api.reactions },
            repos: { get: api.repo },
        };
    },
}));
import { getRepoPopularIssues } from "../controllers/repo-popular-issues.controllers";
const request = { params: { owner: "owner", repo: "repo" }, query: {} } as unknown as AuthRequest;
const issue = {
    number: 1,
    title: "Issue",
    html_url: "https://github.com/owner/repo/issues/1",
    comments: 10,
    updated_at: "2026-01-01T00:00:00Z",
    reactions: { total_count: 1 },
};
describe("인기 Issue API", () => {
    beforeEach(() => {
        vi.stubEnv("PUBLIC_API_TOKEN", undefined);
        api.repo.mockReset();
        api.issues.mockReset();
        api.reactions.mockReset();
    });
    afterEach(() => vi.unstubAllEnvs());
    it("모든 반응을 집계하고 최근 반응 시각을 활동에 반영한다", async () => {
        api.issues.mockResolvedValue({ data: [issue] });
        api.reactions.mockResolvedValue({
            data: [{ created_at: "2026-01-02T00:00:00Z", content: "-1" }],
        });
        const res = { set: vi.fn(), json: vi.fn() } as unknown as Response;
        await getRepoPopularIssues(request, res);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    status: "complete",
                    issues: [
                        expect.objectContaining({
                            number: 1,
                            comments: 10,
                            reactions: 1,
                            reactionCounts: expect.objectContaining({ "-1": 1 }),
                            lastActivityAt: "2026-01-02T00:00:00.000Z",
                        }),
                    ],
                }),
            }),
        );
    });
    it("목록과 반응 수가 다르면 전체 순위를 반환하지 않는다", async () => {
        api.issues.mockResolvedValue({ data: [issue] });
        api.reactions.mockResolvedValue({ data: [] });
        const res = { set: vi.fn(), json: vi.fn() } as unknown as Response;
        await getRepoPopularIssues(request, res);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ status: "partial", issues: null }),
            }),
        );
    });
    it("처음 100개 이후의 후보도 집계하며 반응이 없는 항목에는 상세 요청을 보내지 않는다", async () => {
        const now = new Date().toISOString();
        const low = Array.from({ length: 100 }, (_item, index) => ({
            ...issue,
            number: index + 1,
            comments: 1,
            updated_at: now,
            reactions: { total_count: 0 },
        }));
        const high = {
            ...issue,
            number: 101,
            comments: 100,
            updated_at: now,
            reactions: { total_count: 0 },
        };
        api.issues
            .mockResolvedValueOnce({ data: low, headers: { link: '<next>; rel="next"' } })
            .mockResolvedValueOnce({ data: [high], headers: {} });
        const res = { set: vi.fn(), json: vi.fn() } as unknown as Response;
        await getRepoPopularIssues(request, res);
        const result = vi.mocked(res.json).mock.calls[0][0];
        expect(result.data.status).toBe("complete");
        expect(result.data.issues).toHaveLength(5);
        expect(result.data.issues[0].number).toBe(101);
        expect(api.reactions).not.toHaveBeenCalled();
    });
    it("공개용 토큰으로 조회한 비공개 저장소는 404를 반환한다", async () => {
        vi.stubEnv("PUBLIC_API_TOKEN", "fixture-token");
        api.repo.mockResolvedValue({ data: { private: true } });
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
        await getRepoPopularIssues(request, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(api.issues).not.toHaveBeenCalled();
    });
});
