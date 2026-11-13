import { Router } from "express";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import { GithubGraphqlFetch } from "../client/repo.client";
import { orgDashboardProfileQuery } from "../client/queries/github/org-dashboard-profile.query";
import type { GetOrgDashboardProfileQuery, GetOrgDashboardProfileQueryVariables } from "../types/github/graphql/operations.generated";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonResponse } from "../types/middlewares/common";
import type { GetOrgProfileDto } from "../types/response/org-profile";
import CommonError from "../utils/common-error";

const org_router = Router();

org_router.get("/health", (_req, res) => {
    res.json({ message: "Org route is working!" });
});

/**
 * @api GET /api/orgs/:login/profile
 * @desc GitHub 조직 프로필을 조회합니다. 로그인한 방문자의 토큰이 있으면 해당 토큰을 사용합니다.
 * @github backend/src/client/queries/github/org-dashboard-profile.query.ts
 * @response backend/src/types/response/org-profile.ts
 * @error [400] GitHub 로그인 이름 형식이 잘못된 경우.
 * @error [404] GitHub 조직을 찾을 수 없는 경우.
 * @error [500] 사용자 인증 처리 또는 GitHub 조직 프로필 조회에 실패한 경우.
 */
org_router.get("/:login/profile", checkToken, checkUser, async (req: AuthRequest, res) => {
    const { login } = req.params;
    res.set("Cache-Control", "private, no-store");

    try {
        if (typeof login !== "string" || !/^[a-z\d][a-z\d-]{0,38}$/i.test(login)) {
            throw CommonError.create400Error("GitHub 로그인 이름 형식이 올바르지 않습니다.");
        }
        const variables = { login } satisfies GetOrgDashboardProfileQueryVariables;
        const response = await GithubGraphqlFetch<GetOrgDashboardProfileQuery>(
            req.user?.githubAccessToken,
            orgDashboardProfileQuery,
            variables,
        );
        if (!response.organization) throw CommonError.create404Error("GitHub 조직을 찾을 수 없습니다.");
        const data: GetOrgProfileDto = response;
        const commonResponse: CommonResponse<GetOrgProfileDto> = { status: 200, success: true, data };
        return res.json(commonResponse);
    } catch (error) {
        const notFound = error instanceof Error && "errors" in error && Array.isArray(error.errors) &&
            error.errors.some((item) => item?.type === "NOT_FOUND" && item.path?.[0] === "organization");
        const mappedError = error instanceof CommonError ? error : notFound
            ? CommonError.create404Error("GitHub 조직을 찾을 수 없습니다.")
            : CommonError.create500Error("GitHub 조직 프로필을 조회하지 못했습니다.");
        return res.status(mappedError.status).json(mappedError);
    }
});

export default org_router;
