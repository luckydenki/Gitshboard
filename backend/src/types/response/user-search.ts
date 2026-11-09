import type { GithubSearchUsersItem, GithubSearchUsersResponse } from "../github/rest/user-search";

/**
 * 사용자 검색 응답에 포함되는 계정 항목입니다.
 * GET /api/search/users
 */
type UserSearchItem = Pick<
    GithubSearchUsersItem,
    | "login" // 계정 로그인명
    | "id" // 계정 ID
    | "avatar_url" // 아바타 URL
    | "url" // 계정 REST API URL
    | "html_url" // 웹 프로필 URL
    | "name" // 공개 이름
    | "email" // 공개 이메일
    | "user_view_type" // 계정 정보의 공개 범위
> & {
    type: "User" | "Organization"; // 개인 또는 조직 계정 유형
};

/**
 * 사용자 검색의 최종 응답 data입니다.
 * total_count는 검색 조건에 일치하는 전체 결과 수입니다.
 * GET /api/search/users
 */
export type UserSearchData = Pick<GithubSearchUsersResponse, "total_count"> & {
    items: UserSearchItem[]; // 요청한 페이지의 계정 목록
};
