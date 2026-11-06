import { Router } from "express";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import searchController from "../controllers/search.controllers";
import CommonError from "../utils/common-error";
import type { GitHubUserSearchResponse } from "../types/github/rest/user-search";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import type { UserSearchData } from "../types/response/user-search";

import type { GitHubRepositorySearchResponse } from "../types/github/rest/repository-search";
import type { RepositorySearchData } from "../types/response/repository-search";

const search_router = Router();

search_router.get("/health", (req, res) => {
    res.json({ message: "Search route is working!" });
});

search_router.get("/", checkToken, checkUser, searchController.search);

/**
 * @api GET /api/search/users
 *
 * @desc GitHub 사용자 검색 API를 호출하는 테스트 라우트.
 *
 * @query q (string, 필수) - 검색어와 검색 조건을 포함하는 검색식.
 * @query page (integer, 선택) - 페이지 번호. 기본값 1.
 * @query per_page (integer, 선택) - 페이지당 결과 수. 기본값 30, 최대 100.
 * @query sort (followers | repositories | joined, 선택) - 정렬 기준. 기본값은 관련도순.
 * @query order (asc | desc, 선택) - 정렬 방향. sort 지정 시 적용되며 기본값은 desc.
 *
 * @githubRef https://docs.github.com/en/rest/search/search#search-users
 * @githubRef https://docs.github.com/en/search-github/searching-on-github/searching-users
 *
 * @github GET https://api.github.com/search/users
 *   URL 쿼리 파라미터 q, page, per_page, sort, order를 그대로 전달한다. 요청 본문 없음.
 *   q 안에서는 검색어와 type:user 또는 type:org, language:<언어>, location:<지역>을
 *   공백으로 연결한다. 전체 선택 시 해당 검색 조건을 생략한다.
 *   요청 예시 — https://api.github.com/search/users?q=octocat+type%3Auser+language%3ATypeScript+location%3A%22New+York%22&page=1&per_page=10
 *
 * @githubresponse 200 OK - GitHub 사용자 검색 결과 객체.
 *   total_count (number) - 검색 조건에 일치하는 전체 결과 수.
 *   incomplete_results (boolean) - 검색 결과가 불완전한지 여부.
 *   items (array) - 요청한 페이지의 계정 목록.
 *   items[].login, id, node_id - 계정 로그인명, 숫자 ID, 노드 ID.
 *   items[].type, site_admin, score - 계정 유형, 사이트 관리자 여부, 검색 점수.
 *   items[].avatar_url, gravatar_id - 아바타 URL, Gravatar ID.
 *   items[].url, html_url - 계정 API URL과 웹 프로필 URL.
 *   items[].followers_url, following_url - 팔로워와 팔로잉 API URL.
 *   items[].gists_url, starred_url, subscriptions_url - Gist, 별표, 구독 API URL.
 *   items[].organizations_url, repos_url - 조직과 저장소 API URL.
 *   items[].events_url, received_events_url - 계정 이벤트와 수신 이벤트 API URL.
 *   items[].text_matches (선택) - text-match 미디어 타입 요청 시 검색어 일치 정보.
 *
 * @response UserSearchData
 *   total_count - 검색 조건에 일치하는 전체 결과 수.
 *   items - 요청한 페이지의 계정 배열.
 *   items[].login, id - 계정 로그인명과 숫자 ID.
 *   items[].avatar_url, url, html_url - 아바타, 계정 API, 웹 프로필 URL.
 *   items[].name, email - GitHub가 제공하는 공개 이름과 이메일.
 *   items[].type, user_view_type - 계정 유형과 GitHub가 제공하는 공개 범위.
 *
 * @error [500] : GitHub 요청 실패 또는 응답 JSON 읽기 실패.
 */
const search_users = search_router.get("/users", async (req, res) => {
    console.log("search호출");
    try {
        const { searchParams } = new URL(req.originalUrl, "http://localhost");

        const response = await fetch(
            `https://api.github.com/search/users?${searchParams.toString()}`,
            {
                method: "GET",
            },
        );

        if (!response.ok) {
            throw new CommonError({
                status: 500,
                title: "검색 실패",
                type: "몰라",
                detail: "알 수 없는 이유로 github api의 검색이 실패되었습니다.",
            });
        }

        const json: GitHubUserSearchResponse = await response.json();

        const commonResponse: CommonResponse<UserSearchData> = {
            status: 200,
            success: true,
            data: {
                total_count: json.total_count,
                items: json.items.map((item) => ({
                    login: item.login,
                    id: item.id,
                    avatar_url: item.avatar_url,
                    url: item.url,
                    html_url: item.html_url,
                    name: item.name,
                    email: item.email,
                    type: item.type,
                    user_view_type: item.user_view_type,
                })),
            },
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
 * @api GET /api/search/repositories
 * @desc GitHub에서 검색 조건에 일치하는 저장소를 조회합니다.
 * @query q (string, 필수) - 검색어와 검색 조건을 포함하는 검색식.
 * @query page (integer, 선택) - 페이지 번호. 기본값 1.
 * @query per_page (integer, 선택) - 페이지당 결과 수. 기본값 30, 최대 100.
 * @githubRef https://docs.github.com/en/rest/search/search#search-repositories
 * @github GET https://api.github.com/search/repositories
 *   q, page, per_page를 쿼리로 전달합니다. 요청 본문 없음.
 * @githubresponse GitHubRepositorySearchResponse
 *   전체 결과 수, 불완전 여부와 저장소 목록. 각 항목의 필드는 GitHubRepositorySearchItem을 참조합니다.
 * @response RepositorySearchData
 *   total_count - 전체 결과 수.
 *   incomplete_results - 검색 결과가 불완전한지 여부.
 *   items - 저장소 식별 정보, 설명, 링크, 소유 계정 요약, 언어, 별표 수,
 *   포크 수, 생성 및 업데이트 시각, 라이선스를 담은 목록.
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

        const searchParams = new URLSearchParams({ q: q.trim(), page, per_page });
        const response = await fetch(
            `https://api.github.com/search/repositories?${searchParams.toString()}`,
            { headers: { Accept: "application/vnd.github+json" } },
        );

        if (!response.ok) {
            if (response.status === 422) {
                throw CommonError.create400Error(
                    "GitHub에서 검색 조건 또는 페이지 범위를 처리할 수 없습니다.",
                );
            }
            throw CommonError.create500Error("GitHub 저장소 검색 요청에 실패했습니다.");
        }

        const json: GitHubRepositorySearchResponse = await response.json();
        const data: RepositorySearchData = {
            total_count: json.total_count,
            incomplete_results: json.incomplete_results,
            items: json.items.map((item) => ({
                id: item.id,
                name: item.name,
                full_name: item.full_name,
                description: item.description,
                html_url: item.html_url,
                owner: {
                    login: item.owner.login,
                    avatar_url: item.owner.avatar_url,
                    html_url: item.owner.html_url,
                    type: item.owner.type,
                },
                language: item.language,
                stargazers_count: item.stargazers_count,
                forks_count: item.forks_count,
                created_at: item.created_at,
                updated_at: item.updated_at,
                license: item.license,
            })),
        };
        const commonResponse: CommonResponse<RepositorySearchData> = {
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
