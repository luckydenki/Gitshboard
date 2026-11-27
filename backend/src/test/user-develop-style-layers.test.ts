import { it, expect, vi } from "vitest";
import UserDevelopStyleServices from "../services/user-develop-style.services";
import GithubUserDevelopStyleClient from "../client/user-develop-style.client";
import CommonError from "../utils/common-error";
import UserDevelopStyleControllers from "../controllers/user-develop-style.controllers";
it("서비스는 잘못된 사용자명을 외부 호출 전에 400 오류로 거절", async () => {
    await expect(
        new UserDevelopStyleServices().getOverview("bad--name", "UTC", []),
    ).rejects.toMatchObject({ status: 400 });
});
it("서비스는 클라이언트 공통 오류를 그대로 전달", async () => {
    const error = new CommonError({ status: 403, type: "GitHub API", title: "호출 제한" });
    const spy = vi
        .spyOn(GithubUserDevelopStyleClient.prototype, "listRepositories")
        .mockRejectedValueOnce(error);
    await expect(new UserDevelopStyleServices().getOverview("octocat", "UTC", [])).rejects.toBe(
        error,
    );
    spy.mockRestore();
});
it("컨트롤러는 하위 공통 오류를 그대로 응답", async () => {
    const error = new CommonError({ status: 429, type: "GitHub API", title: "호출 제한" });
    const spy = vi
        .spyOn(UserDevelopStyleServices.prototype, "getOverview")
        .mockRejectedValueOnce(error);
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await new UserDevelopStyleControllers().getOverview(
        { params: { login: "octocat" }, query: {} } as any,
        res,
    );
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(error);
    spy.mockRestore();
});
