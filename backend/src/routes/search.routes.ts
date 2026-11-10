import { Router } from "express";
import { Octokit } from "@octokit/rest";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import { GITHUB_REST_API_VERSION } from "../server.config";
import CommonError from "../utils/common-error";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import { GithubGraphqlFetch } from "../client/repo.client";
import { githubSearchUsersQuery } from "../client/queries/github/search-users.query";
import type {
    SearchUsersQuery,
    SearchUsersQueryVariables,
} from "../types/github/graphql/operations.generated";
import type { GetSearchDto } from "../types/response/search";
import type { GetSearchUsersDto } from "../types/response/search-users";
import type { GetSearchReposDto } from "../types/response/search-repos";

const search_router = Router();
const octokit = new Octokit();
const githubRestHeaders = { "X-GitHub-Api-Version": GITHUB_REST_API_VERSION };

search_router.get("/health", (req, res) => {
    res.json({ message: "Search route is working!" });
});

/**
 * @api GET /api/search
 *
 * @desc 기존 클라이언트용 GitHub 사용자 검색입니다.
 *
 * @query q (string, 필수) - 검색어와 검색 조건.
 * @query page (integer, 선택) - 페이지 번호. 기본값 1.
 * @query per_page (integer, 선택) - 페이지당 결과 수. 기본값 10, 최대 100.
 *
 * @github backend/src/types/github/rest/search-users.ts
 *
 * @response backend/src/types/response/search.ts
 *
 * @error [400] : 검색어 또는 페이지 입력이 잘못됐거나 GitHub가 검색 조건을 거부한 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 검색이 실패한 경우.
 */
search_router.get("/", checkToken, checkUser, async (req: AuthRequest, res) => {
    try {
        const { q, page = "1", per_page = "12" } = req.query;
        if (typeof q !== "string" || !q.trim()) {
            throw CommonError.create400Error("검색어를 입력해 주세요.");
        }
        if (
            typeof page !== "string" ||
            !/^\d+$/.test(page) ||
            !Number.isSafeInteger(Number(page)) ||
            Number(page) < 1
        ) {
            throw CommonError.create400Error("페이지 번호는 1 이상의 정수여야 합니다.");
        }
        if (
            typeof per_page !== "string" ||
            !/^\d+$/.test(per_page) ||
            Number(per_page) < 1 ||
            Number(per_page) > 100
        ) {
            throw CommonError.create400Error("페이지당 결과 수는 1부터 100까지의 정수여야 합니다.");
        }

        const auth = req.user?.githubAccessToken;
        const searchOctokit = auth ? new Octokit({ auth }) : octokit;
        const { data: response } = await searchOctokit.rest.search.users({
            q,
            page: Number(page),
            per_page: Number(per_page),
            headers: githubRestHeaders,
        });
        const data: GetSearchDto = {
            total_count: response.total_count,
            incomplete_results: response.incomplete_results,
            items: response.items.map(({ id, avatar_url, html_url, login, type }) => ({
                id,
                avatar_url,
                html_url,
                login,
                type,
            })),
        };
        const commonResponse: CommonResponse<GetSearchDto> = { status: 200, success: true, data };
        res.json(commonResponse);
    } catch (error) {
        let errorResponse: CommonErrorResponse;
        if (error instanceof CommonError) {
            errorResponse = error;
        } else if (error instanceof Error && "status" in error && error.status === 422) {
            errorResponse = CommonError.create400Error(
                "GitHub에서 검색 조건을 처리할 수 없습니다.",
            );
        } else {
            errorResponse = CommonError.create500Error(
                "GitHub 사용자 검색 응답을 처리하지 못했습니다.",
            );
        }
        res.status(errorResponse.status).json(errorResponse);
    }
});

/**
 * @api GET /api/search/users
 *
 * @desc GitHub의 사용자·조직 검색 결과와 카드에 필요한 공개 프로필 정보를 조회합니다.
 *
 * @query q (string, 필수) - 검색어 및 type, language, location 등의 검색 조건.
 * @query per_page (integer, 선택) - 페이지당 결과 수. 기본값 30, 최대 100.
 * @query after (string, 선택) - 이전 응답의 page_info.end_cursor.
 * @query page (integer, 선택) - 기존 페이지 번호 요청용. 기본값 1. after와 함께 사용할 때는 1만 허용.
 * @query sort (followers | repositories | joined, 선택) - 정렬 기준.
 * @query order (asc | desc, 선택) - 정렬 방향. sort 지정 시 기본값 desc.
 *
 * @github backend/src/client/queries/github/search-users.query.ts
 *
 * @response backend/src/types/response/search-users.ts
 *
 * @error [400] : 검색어, 페이지, 커서 또는 정렬 옵션이 잘못된 경우.
 * @error [500] : GitHub 검색 요청이 실패한 경우.
 */
search_router.get("/users", async (req, res) => {
    try {
        console.log("/search/users :", req.query);
        const { q, page = "1", per_page = "12", after, sort, order } = req.query;

        if (typeof q !== "string" || !q.trim()) {
            throw CommonError.create400Error("검색어를 입력해 주세요.");
        }
        if (
            typeof page !== "string" ||
            !/^\d+$/.test(page) ||
            !Number.isSafeInteger(Number(page)) ||
            Number(page) < 1
        ) {
            throw CommonError.create400Error("페이지 번호는 1 이상의 정수여야 합니다.");
        }
        if (
            typeof per_page !== "string" ||
            !/^\d+$/.test(per_page) ||
            Number(per_page) < 1 ||
            Number(per_page) > 100
        ) {
            throw CommonError.create400Error("페이지당 결과 수는 1부터 100까지의 정수여야 합니다.");
        }
        if (
            after !== undefined &&
            (typeof after !== "string" || !after.trim() || Number(page) !== 1)
        ) {
            throw CommonError.create400Error(
                "유효한 커서를 보내고 페이지 번호는 1로 지정해 주세요.",
            );
        }
        if (
            sort !== undefined &&
            sort !== "followers" &&
            sort !== "repositories" &&
            sort !== "joined"
        ) {
            throw CommonError.create400Error("지원하지 않는 사용자 검색 정렬 기준입니다.");
        }
        if (order !== undefined && order !== "asc" && order !== "desc") {
            throw CommonError.create400Error("정렬 방향은 asc 또는 desc여야 합니다.");
        }

        const perPage = Number(per_page);
        let remainingOffset = (Number(page) - 1) * perPage;
        if (remainingOffset >= 1000) {
            throw CommonError.create400Error("검색 결과는 처음 1,000개까지 조회할 수 있습니다.");
        }

        const searchQuery = sort ? `${q.trim()} sort:${sort}-${order ?? "desc"}` : q.trim();
        const variables: SearchUsersQueryVariables = {
            searchQuery,
            first: perPage,
            after: after ?? null,
        };

        // 기존 페이지 번호 요청은 앞선 결과를 건너뛸 커서를 먼저 찾습니다.
        while (remainingOffset > 0) {
            const first = Math.min(remainingOffset, 100);
            const cursor_response = await GithubGraphqlFetch<SearchUsersQuery>(
                undefined,
                githubSearchUsersQuery,
                { ...variables, first },
            );
            const { search } = cursor_response;
            const { hasNextPage, endCursor } = search.pageInfo;
            if (!hasNextPage || !endCursor) {
                const data: GetSearchUsersDto = {
                    total_count: search.userCount,
                    items: [],
                    page_info: { has_next_page: false, end_cursor: null },
                };
                const commonResponse: CommonResponse<GetSearchUsersDto> = {
                    status: 200,
                    success: true,
                    data,
                };
                res.json(commonResponse);
                return;
            }
            variables.after = endCursor;
            remainingOffset -= first;
        }

        const response = await GithubGraphqlFetch<SearchUsersQuery>(
            undefined,
            githubSearchUsersQuery,
            variables,
        );

        console.log("response", response);
        const { search } = response;

        const data: GetSearchUsersDto = {
            total_count: search.userCount,
            items: (search.nodes ?? []).flatMap((node) => {
                if (node?.__typename !== "User" && node?.__typename !== "Organization") return [];

                return [
                    {
                        id: node.id,
                        login: node.login,
                        name: node.name ?? null,
                        avatar_url: node.avatarUrl,
                        html_url: node.url,
                        type: node.__typename,
                        bio: node.bio ?? null,
                        location: node.location ?? null,
                        updated_at: node.updatedAt,
                    },
                ];
            }),
            page_info: {
                has_next_page: search.pageInfo.hasNextPage,
                end_cursor: search.pageInfo.endCursor ?? null,
            },
        };
        const commonResponse: CommonResponse<GetSearchUsersDto> = {
            status: 200,
            success: true,
            data,
        };
        res.json(commonResponse);
    } catch (error) {
        const errorResponse: CommonErrorResponse =
            error instanceof CommonError
                ? error
                : CommonError.create500Error("GitHub 사용자 검색 응답을 처리하지 못했습니다.");
        res.status(errorResponse.status).json(errorResponse);
    }
});

/**
 * @api GET /api/search/repos
 *
 * @desc GitHub에서 검색 조건에 일치하는 저장소를 조회합니다.
 *
 * @query q (string, 필수) - 검색어와 검색 조건을 포함하는 검색식.
 * @query page (integer, 선택) - 페이지 번호. 기본값 1.
 * @query per_page (integer, 선택) - 페이지당 결과 수. 기본값 30, 최대 100.
 *
 * @github backend/src/types/github/rest/search-repos.ts
 *
 * @response backend/src/types/response/search-repos.ts
 *
 * @error [400] : 검색어 또는 페이지 입력이 잘못됐거나 GitHub가 검색 조건을 거부한 경우.
 * @error [500] : GitHub 요청 또는 응답 처리 실패.
 */
search_router.get("/repos", async (req, res) => {
    try {
        const { q, page = "1", per_page = "30" } = req.query;

        if (typeof q !== "string" || !q.trim()) {
            throw CommonError.create400Error("검색어를 입력해 주세요.");
        }

        if (
            typeof page !== "string" ||
            !/^\d+$/.test(page) ||
            !Number.isSafeInteger(Number(page)) ||
            Number(page) < 1
        ) {
            throw CommonError.create400Error("페이지 번호는 1 이상의 정수여야 합니다.");
        }

        if (
            typeof per_page !== "string" ||
            !/^\d+$/.test(per_page) ||
            Number(per_page) < 1 ||
            Number(per_page) > 100
        ) {
            throw CommonError.create400Error("페이지당 결과 수는 1부터 100까지의 정수여야 합니다.");
        }

        const { data: response } = await octokit.rest.search
            .repos({
                q: q.trim(),
                page: Number(page),
                per_page: Number(per_page),
                headers: githubRestHeaders,
            })
            .catch((error: unknown) => {
                if (error instanceof Error && "response" in error && error.response) {
                    if ("status" in error && error.status === 422) {
                        throw CommonError.create400Error(
                            "GitHub에서 검색 조건 또는 페이지 범위를 처리할 수 없습니다.",
                        );
                    }
                    throw CommonError.create500Error("GitHub 저장소 검색 요청에 실패했습니다.");
                }
                throw error;
            });
        const data: GetSearchReposDto = {
            total_count: response.total_count,
            incomplete_results: response.incomplete_results,
            items: response.items.map((item) => {
                const { owner } = item;
                if (!owner) {
                    throw CommonError.create500Error(
                        "GitHub 저장소 검색 응답을 처리하지 못했습니다.",
                    );
                }
                return {
                    id: item.id,
                    name: item.name,
                    full_name: item.full_name,
                    description: item.description,
                    html_url: item.html_url,
                    owner: {
                        login: owner.login,
                        avatar_url: owner.avatar_url,
                        html_url: owner.html_url,
                        type: owner.type as GetSearchReposDto["items"][number]["owner"]["type"],
                    },
                    language: item.language,
                    stargazers_count: item.stargazers_count,
                    forks_count: item.forks_count,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    license: item.license,
                };
            }),
        };
        const commonResponse: CommonResponse<GetSearchReposDto> = {
            status: 200,
            success: true,
            data,
        };
        res.json(commonResponse);
    } catch (error) {
        const errorResponse: CommonErrorResponse =
            error instanceof CommonError
                ? error
                : CommonError.create500Error("GitHub 저장소 검색 응답을 처리하지 못했습니다.");
        res.status(errorResponse.status).json(errorResponse);
    }
});

export default search_router;
