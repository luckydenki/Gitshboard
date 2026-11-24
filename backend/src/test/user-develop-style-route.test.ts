import { it, expect, vi } from "vitest";
vi.mock("@octokit/rest", () => ({
    Octokit: class {
        repos = {
            listForUser: vi
                .fn()
                .mockResolvedValue({ data: [{ name: "r", fork: false, topics: ["react"] }] }),
            listLanguages: vi.fn().mockResolvedValue({ data: { TypeScript: 60, JavaScript: 40 } }),
        };
        activity = { listPublicEventsForUser: vi.fn().mockResolvedValue({ data: [] }) };
    },
}));
import UserDevelopStyleControllers from "../controllers/user-develop-style.controllers";
const handler: import("express").RequestHandler = new UserDevelopStyleControllers().getOverview;
it("호출 성공 시 CommonResponse와 언어 비율을 반환", async () => {
    const res: any = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        json: vi.fn(),
    };
    await handler(
        {
            params: { login: "octocat" },
            query: { timezone: "UTC" },
            originalUrl: "/api/users/octocat/develop-style",
        } as any,
        res,
        vi.fn(),
    );
    expect(res.json.mock.calls[0][0]).toMatchObject({
        status: 200,
        success: true,
        data: {
            languages: [
                { language: "TypeScript", percentage: 60 },
                { language: "JavaScript", percentage: 40 },
            ],
            topics: [{ name: "react", count: 1 }],
        },
    });
});
it("잘못된 시간대는 400", async () => {
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await handler(
        { params: { login: "octocat" }, query: { timezone: "invalid" } } as any,
        res,
        vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(400);
});
