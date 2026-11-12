import { Router } from "express";
import { Octokit } from "@octokit/rest";
import { authToken, authUser, checkToken } from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controllers";
import { AuthRequest, UserWithAccessToken } from "../types/middlewares/auth";
import { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import type { GithubAppsCheckTokenDto } from "../types/github/rest/apps-check-token";
import type { GetAuthGithubScopesDto } from "../types/response/auth-github-scopes";
import CommonError from "../utils/common-error";

const auth_router = Router();
const octokit = new Octokit();

// api/auth/health
auth_router.get("/health", (req, res) => {
    res.json({ message: "Auth route is working!" });
});

// api/auth
// 토큰 검증과 user 객체만 가져오는 api
auth_router.get("/", authToken, authUser, (req: AuthRequest, res) => {
    const response: CommonResponse<UserWithAccessToken> = {
        success: true,
        status: 200,
        data: req.user,
    };

    res.status(200).json(response);
});

//  api/auth/check
// 로그인 된 사용자인지 단순 체크하는 api
auth_router.get("/check", checkToken, authController.check);

// api/auth/github
// 깃허브 로그인 시, 깃허브에서 받은 code를 이용하여 access_token을 발급받고,
// 해당 access_token으로 깃허브 사용자 정보를 가져오는 api
auth_router.post("/github", authController.getGithubUser);

/**
 * @api GET /api/auth/github/scopes
 *
 * @desc 로그인한 사용자의 GitHub OAuth 토큰에 부여된 스코프를 조회합니다.
 *
 * @github backend/src/types/github/rest/apps-check-token.ts
 *
 * @response backend/src/types/response/auth-github-scopes.ts
 *
 * @error [401] : 앱 로그인 정보가 없거나 유효하지 않은 경우, GitHub 토큰이 없거나 유효하지 않은 경우.
 * @error [404] : 인증 미들웨어가 사용자 정보를 찾지 못한 경우.
 * @error [500] : 사용자 인증 처리, OAuth 앱 설정 또는 GitHub 스코프 조회에 실패한 경우.
 */
auth_router.get("/github/scopes", authToken, authUser, async (req: AuthRequest, res) => {
    res.set("Cache-Control", "no-store");

    try {
        const { githubAccessToken } = req.user ?? {};
        if (!githubAccessToken) {
            throw CommonError.create401Error("GitHub 토큰이 없습니다. 다시 로그인해 주세요.");
        }

        const { GITHUB_CLIENT_ID: clientId, GITHUB_CLIENT_SECRET: clientSecret } = process.env;
        if (!clientId || !clientSecret) {
            throw CommonError.create500Error("GitHub OAuth 앱 설정이 누락되었습니다.");
        }

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const { data: response }: { data: GithubAppsCheckTokenDto } =
            await octokit.rest.apps.checkToken({
                client_id: clientId,
                access_token: githubAccessToken,
                headers: { authorization: `Basic ${credentials}` },
            });

        const data: GetAuthGithubScopesDto = { scopes: response.scopes };
        const commonResponse: CommonResponse<GetAuthGithubScopesDto> = {
            status: 200,
            success: true,
            data,
        };
        res.json(commonResponse);
    } catch (error) {
        let errorResponse: CommonErrorResponse;
        if (error instanceof CommonError) {
            errorResponse = error;
        } else if (error instanceof Error && "status" in error && error.status === 404) {
            errorResponse = CommonError.create401Error(
                "GitHub 토큰이 유효하지 않습니다. 다시 로그인해 주세요.",
            );
        } else {
            errorResponse = CommonError.create500Error("GitHub 스코프를 조회하지 못했습니다.");
        }

        res.status(errorResponse.status).json(errorResponse);
    }
});

auth_router.post("/logout", authToken, authUser, authController.logoutUser);

auth_router.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

export default auth_router;
