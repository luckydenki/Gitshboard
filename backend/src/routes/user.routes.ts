import Router from "express";
import { AuthRequest } from "../types/middlewares/auth";
import { authToken, authUser, checkToken, checkUser } from "../middlewares/auth.middleware";
import {
    CommonErrorResponse,
    CommonResponse,
    ErrorStatus,
} from "../types/middlewares/common";
import { GithubUser } from "../client/user.client";
import { GithubGraphqlFetch } from "../client/repo.client";
import { userHeaderQuery } from "../client/queries/github/user-header.query";
import { userDashboardProfileQuery } from "../client/queries/github/user-dashboard-profile.query";
import { userRecentActivityQuery } from "../client/queries/github/user-recent-activity.query";
import { userRecentCommitsQuery } from "../client/queries/github/user-recent-commits.query";
import { userPublicRepositoriesQuery } from "../client/queries/github/user-public-repositories.query";
import type {
    GetUserQuery,
    GetUserQueryVariables,
    GetUserDashboardProfileQuery,
    GetUserDashboardProfileQueryVariables,
    GetUserRecentActivityQuery,
    GetUserRecentActivityQueryVariables,
    GetUserRecentCommitsQuery,
    GetUserRecentCommitsQueryVariables,
    GetUserPublicRepositoriesQuery,
    GetUserPublicRepositoriesQueryVariables,
} from "../types/github/graphql/operations.generated";
import type { GetUserRepositoriesDto } from "../types/response/user-repositories";
import type { GetUserProfileDto } from "../types/response/user-profile";
import type {
    GetUserRecentActivityDto,
    UserRecentActivityItem,
} from "../types/response/user-recent-activity";
import CommonError from "../utils/common-error";
import { calculateContributionStreak } from "../utils/contribution-streak";

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

/**
 * @api GET /api/users/:login/profile
 *
 * @desc GitHub 프로필, 팔로워·팔로잉 수, 소셜 링크, 기여 캘린더와 연속 활동 일수를 조회합니다. 로그인한 방문자의 토큰이 있으면 해당 토큰을 사용합니다.
 *
 * @github backend/src/client/queries/github/user-dashboard-profile.query.ts
 *
 * @response backend/src/types/response/user-profile.ts
 *
 * @error [400] : GitHub 로그인 이름 형식이 잘못된 경우.
 * @error [404] : GitHub 사용자를 찾을 수 없는 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 프로필 조회에 실패한 경우.
 */
user_router.get("/:login/profile", checkToken, checkUser, async (req: AuthRequest, res) => {
    const { login } = req.params;
    res.set("Cache-Control", "private, no-store");

    try {
        if (typeof login !== "string" || !/^[a-z\d][a-z\d-]{0,38}$/i.test(login)) {
            throw CommonError.create400Error("GitHub 로그인 이름 형식이 올바르지 않습니다.");
        }

        const variables = { login } satisfies GetUserDashboardProfileQueryVariables;
        const response = await GithubGraphqlFetch<GetUserDashboardProfileQuery>(
            req.user?.githubAccessToken,
            userDashboardProfileQuery,
            variables,
        );
        if (!response.user) {
            throw CommonError.create404Error("GitHub 사용자를 찾을 수 없습니다.");
        }

        const { weeks } = response.user.contributionsCollection.contributionCalendar;
        const days = weeks.flatMap(({ contributionDays }) => contributionDays);
        const today = new Date().toISOString().slice(0, 10);
        const data: GetUserProfileDto = {
            ...response,
            streakDays: calculateContributionStreak(days, today),
        };
        const commonResponse: CommonResponse<GetUserProfileDto> = {
            status: 200,
            success: true,
            data,
        };
        res.json(commonResponse);
    } catch (error) {
        const errorResponse = getPublicUserError(error, "GitHub 프로필을 조회하지 못했습니다.");
        res.status(errorResponse.status).json(errorResponse);
    }
});

/**
 * @api GET /api/users/:login/recent-activity
 *
 * @desc 공개 이슈·PR과 최근 30일 동안 기여한 최대 100개 공개 저장소의 기본 브랜치 커밋을 최신순으로 반환합니다.
 *
 * @query limit (integer, 선택) - 반환할 최대 활동 수. 기본값 10, 범위 1~30.
 *
 * @github backend/src/client/queries/github/user-recent-activity.query.ts
 * @github backend/src/client/queries/github/user-recent-commits.query.ts
 *
 * @response backend/src/types/response/user-recent-activity.ts
 *
 * @error [400] : GitHub 로그인 이름 또는 limit 형식이 잘못된 경우.
 * @error [404] : GitHub 사용자를 찾을 수 없는 경우.
 * @error [500] : GitHub 최근 활동 조회에 실패한 경우.
 */
user_router.get("/:login/recent-activity", async (req, res) => {
    const { login } = req.params;
    const { limit: requestedLimit = "10" } = req.query;

    try {
        if (!/^[a-z\d][a-z\d-]{0,38}$/i.test(login)) {
            throw CommonError.create400Error("GitHub 로그인 이름 형식이 올바르지 않습니다.");
        }
        if (typeof requestedLimit !== "string" || !/^(?:[1-9]|[12]\d|30)$/.test(requestedLimit)) {
            throw CommonError.create400Error("활동 개수는 1부터 30까지의 정수여야 합니다.");
        }

        const limit = Number(requestedLimit);
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const variables = { login, limit, since } satisfies GetUserRecentActivityQueryVariables;
        const response = await GithubGraphqlFetch<GetUserRecentActivityQuery>(
            undefined,
            userRecentActivityQuery,
            variables,
        );
        const { user } = response;
        if (!user) {
            throw CommonError.create404Error("GitHub 사용자를 찾을 수 없습니다.");
        }

        const items: UserRecentActivityItem[] = [];
        for (const type of ["issue", "pull-request"] as const) {
            const connection = type === "issue" ? user.issues : user.pullRequests;
            for (const node of connection.nodes ?? []) {
                if (node?.repository.visibility !== "PUBLIC") continue;
                items.push({
                    type,
                    id: node.id,
                    number: node.number,
                    title: node.title,
                    state: node.state,
                    url: node.url,
                    nameWithOwner: node.repository.nameWithOwner,
                    occurredAt: node.createdAt,
                    authorLogin: node.author?.login ?? null,
                    commentCount: node.comments.totalCount,
                });
            }
        }

        const repositoryIds = user.contributionsCollection.commitContributionsByRepository
            .map(({ repository }) => repository)
            .filter(({ visibility }) => visibility === "PUBLIC")
            .map(({ id }) => id);
        if (repositoryIds.length > 0) {
            const commitVariables = {
                repositoryIds,
                authorId: user.id,
                limit,
                since,
            } satisfies GetUserRecentCommitsQueryVariables;
            const commitResponse = await GithubGraphqlFetch<GetUserRecentCommitsQuery>(
                undefined,
                userRecentCommitsQuery,
                commitVariables,
            );

            for (const repository of commitResponse.nodes) {
                if (repository?.__typename !== "Repository" || repository.visibility !== "PUBLIC") {
                    continue;
                }
                const commit = repository.defaultBranchRef?.target;
                if (commit?.__typename !== "Commit") continue;

                for (const node of commit.history.nodes ?? []) {
                    if (!node) continue;
                    items.push({
                        ...node,
                        type: "commit",
                        id: `${repository.nameWithOwner}:${node.oid}`,
                        nameWithOwner: repository.nameWithOwner,
                        occurredAt: node.committedDate,
                    });
                }
            }
        }

        items.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt));
        const data: GetUserRecentActivityDto = { items: items.slice(0, limit) };
        const commonResponse: CommonResponse<GetUserRecentActivityDto> = {
            status: 200,
            success: true,
            data,
        };
        res.json(commonResponse);
    } catch (error) {
        const errorResponse = getPublicUserError(error, "GitHub 최근 활동을 조회하지 못했습니다.");
        res.status(errorResponse.status).json(errorResponse);
    }
});

/**
 * @api GET /api/users/:login/repositories
 *
 * @desc 사용자 소유의 공개 저장소 목록과 저장소 수, 스타·포크 합계를 조회합니다.
 *
 * @github backend/src/client/queries/github/user-public-repositories.query.ts
 *
 * @response backend/src/types/response/user-repositories.ts
 *
 * @error [400] : GitHub 로그인 이름 형식이 잘못된 경우.
 * @error [404] : GitHub 사용자를 찾을 수 없는 경우.
 * @error [500] : GitHub 저장소 목록 조회에 실패한 경우.
 */
user_router.get("/:login/repositories", checkToken, checkUser, async (req: AuthRequest, res) => {
    const { login } = req.params;

    try {
        if (typeof login !== "string" || !/^[a-z\d][a-z\d-]{0,38}$/i.test(login)) {
            throw CommonError.create400Error("GitHub 로그인 이름 형식이 올바르지 않습니다.");
        }

        const data: GetUserRepositoriesDto = {
            repositories: [],
            totalCount: 0,
            totalStars: 0,
            totalForks: 0,
        };
        let after: string | null = null;

        do {
            const variables: GetUserPublicRepositoriesQueryVariables = { login, after };
            const response = await GithubGraphqlFetch<GetUserPublicRepositoriesQuery>(
                req.user?.githubAccessToken,
                userPublicRepositoriesQuery,
                variables,
            );
            if (!response.user) {
                throw CommonError.create404Error("GitHub 사용자를 찾을 수 없습니다.");
            }

            const { nodes, pageInfo, totalCount } = response.user.repositories;
            data.totalCount = totalCount;
            for (const repository of nodes ?? []) {
                if (!repository) continue;
                data.repositories.push(repository);
                data.totalStars += repository.stargazerCount;
                data.totalForks += repository.forkCount;
            }

            const { hasNextPage, endCursor } = pageInfo;
            if (hasNextPage && (!endCursor || endCursor === after)) {
                throw CommonError.create500Error("GitHub 저장소의 다음 페이지를 찾지 못했습니다.");
            }
            after = hasNextPage ? endCursor ?? null : null;
        } while (after);

        const commonResponse: CommonResponse<GetUserRepositoriesDto> = {
            status: 200,
            success: true,
            data,
        };
        res.json(commonResponse);
    } catch (error) {
        const errorResponse = getPublicUserError(error, "GitHub 저장소 목록을 조회하지 못했습니다.");
        res.status(errorResponse.status).json(errorResponse);
    }
});

function getPublicUserError(error: unknown, detail: string): CommonErrorResponse {
    if (error instanceof CommonError) return error;
    if (error instanceof Error && "errors" in error && Array.isArray(error.errors)) {
        const userNotFound = error.errors.some(
            (item) => item?.type === "NOT_FOUND" && item.path?.[0] === "user",
        );
        if (userNotFound) {
            return CommonError.create404Error("GitHub 사용자를 찾을 수 없습니다.");
        }
    }
    return CommonError.create500Error(detail);
}

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
