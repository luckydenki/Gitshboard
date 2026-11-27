import type { RestEndpointMethodTypes } from "@octokit/rest";

/** 저장소 식별자와 현재 Git 용량을 조회합니다. link : https://docs.github.com/en/rest/repos/repos#get-a-repository */
export type GithubRestReposGetResponse = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];
