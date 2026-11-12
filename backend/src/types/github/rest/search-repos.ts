import type { RestEndpointMethodTypes } from "@octokit/rest";

/**
 * GitHub 저장소 검색의 원본 응답 본문입니다.
 * type : REST
 * req : GET https://api.github.com/search/repositories
 * link : https://docs.github.com/en/rest/search/search#search-repositories
 */
export type GithubSearchReposDto =
    RestEndpointMethodTypes["search"]["repos"]["response"]["data"];

/** GitHub 저장소 검색 결과의 개별 저장소입니다. */
export type GithubSearchReposItem = GithubSearchReposDto["items"][number];
