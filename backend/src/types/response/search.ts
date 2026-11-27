import type { GithubSearchUsersDto, GithubSearchUsersItem } from "../github/rest/search-users";

/** GET /api/search의 기존 사용자 검색 응답 본문입니다. */
export type GetSearchDto = Pick<GithubSearchUsersDto, "total_count" | "incomplete_results"> & {
    items: Pick<GithubSearchUsersItem, "id" | "avatar_url" | "html_url" | "login" | "type">[];
};
