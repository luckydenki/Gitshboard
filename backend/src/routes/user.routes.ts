import Router from "express";
import { AuthRequest } from "../types/middlewares/auth";
import { authToken, authUser } from "../middlewares/auth.middleware";
import {
    CommonErrorResponse,
    CommonResponse,
    ErrorStatus,
} from "../types/middlewares/common";
import { GithubUser } from "../client/user.client";
import { GithubGraphqlFetch } from "../client/repo.client";
import { userHeaderQuery } from "../client/queries/github/user-header.query";
import type {
    GetUserQuery,
    GetUserQueryVariables,
} from "../types/github/graphql/operations.generated";

const user_router = Router();

// api/users/health
user_router.get("/health", (req, res) => {
    res.json({ message: "User route is working!" });
});

// api/users
user_router.get("/", authToken, authUser, async (req: AuthRequest, res) => {
    const user = req.user!; //authUser 미들웨어에서 인증된 사용자 정보를 요청 객체에 추가했으므로 req.user는 항상 존재한다고 가정할 수 있음

    console.log("Authenticated user:", user);

    try {
        const accessToken = user.githubAccessToken;

        const github_response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        if (github_response.ok) {
            const github_user = await github_response.json();

            const response: CommonResponse<typeof github_user> = {
                success: true,
                status: 200,
                data: github_user,
            };
            res.status(200).json(response);
        } else {
            const errorResponse: CommonErrorResponse = {
                status: github_response.status as ErrorStatus,
                title: "GitHub API 요청 실패",
                type: "GitHub API Error",
                detail: `GitHub API 요청 중 오류가 발생했습니다. 상태 코드: ${github_response.status}`,
                instance: "/api/users",
            };

            throw errorResponse;
        }
    } catch (err: unknown) {
        let errorResponse: CommonErrorResponse;

        if (err instanceof Error) {
            errorResponse = {
                status: 500,
                title: "Internal Server Error",
                type: "Server Error",
                detail: err.message,
                instance: "/api/users",
            };
        } else errorResponse = err as CommonErrorResponse;

        res.status(errorResponse?.status || 500).json(errorResponse);
    }
});

/**
 *     userDataState : {
        avatar_url : string,
        login : string
    }
    오직 헤더 컴포넌트만을 위해 가져오는 간단한 정보
 **/
// api/users/userheader
user_router.get("/userheader", authToken, authUser, async (req: AuthRequest, res) => {
    const user = req.user!;

    const variables = { login: user.githubUsername } satisfies GetUserQueryVariables;
    try {
        const { user: userData } = await GithubGraphqlFetch<GetUserQuery>(
            user.githubAccessToken,
            userHeaderQuery,
            variables,
        );
        const response: CommonResponse<typeof userData> = {
            status: 200,
            success: true,
            data: userData ?? null,
        };
        res.status(200).json(response);
    } catch (error) {
        const status =
            error instanceof Error &&
            "status" in error &&
            typeof error.status === "number" &&
            error.status >= 400 &&
            error.status < 600
                ? (error.status as ErrorStatus)
                : 500;
        const errorResponse: CommonErrorResponse = {
            status,
            type: "GitHub API Error",
            title: "GitHub API 요청 실패",
            detail: "GitHub 사용자 헤더 정보를 가져오지 못했습니다.",
            instance: "/api/users/userheader",
        };
        res.status(status).json(errorResponse);
    }
});

// api/users/repos
user_router.get("/repos", authToken, authUser, async (req: AuthRequest, res) => {
    const user = req.user!;
    const username = user.githubUsername;
    const accessToken = user.githubAccessToken;

    try {
        const github_response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        console.log("GitHub API response status:", github_response.status);

        if (github_response.ok) {
            const github_repos = await github_response.json();
            const response_data = {
                repos: github_repos,
            };

            const response: CommonResponse<typeof github_repos> = {
                success: true,
                status: 200,
                data: response_data,
            };

            res.status(200).json(response);
        } else {
            const errorResponse: CommonErrorResponse = {
                status: github_response.status as ErrorStatus,
                title: "GitHub API 요청 실패",
                type: "GitHub API Error",
                detail: `GitHub API 요청 중 오류가 발생했습니다. 상태 코드: ${github_response.status}`,
                instance: "/api/users/repos",
            };
            throw errorResponse;
        }
    } catch (error: any) {
        //어떤 이유에 의한 에러인게 구체적으로 들어오면 항상 {status, message} 형태로 error가 옵니다.
        if ("status" in error) {
            res.status(error.status).json(error);
        } else {
            const errorResponse: CommonErrorResponse = {
                status: 500,
                title: "Internal Server Error",
                type: "Server Error",
                detail: error.message || "서버 에러",
                instance: "/api/users/repos",
            };
            res.status(500).json(errorResponse);
        }
    }
});

// api/users/* (catch-all route for undefined routes)
user_router.use((req, res) => {
    const errorResponse: CommonErrorResponse = {
        status: 404,
        title: "Not Found",
        type: "Route Not Found",
        detail: `The requested route ${req.originalUrl} was not found on this server.`,
        instance: req.originalUrl,
    };

    res.status(404).json(errorResponse);
});

export default user_router;
