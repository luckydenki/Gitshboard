import type { RestEndpointMethodTypes } from "@octokit/rest";

/**
 * GitHub 사용자 검색의 원본 응답 본문입니다.
 * type : REST
 * req : GET https://api.github.com/search/users
 * link : https://docs.github.com/en/rest/search/search#search-users
 */
export type GithubSearchUsersResponse =
    RestEndpointMethodTypes["search"]["users"]["response"]["data"];

/** GitHub 사용자 검색 결과의 개별 계정입니다. */
export type GithubSearchUsersItem = GithubSearchUsersResponse["items"][number];
