import type { RestEndpointMethodTypes } from "@octokit/rest";

/** 저장소의 이슈 및 PR 목록입니다. link : https://docs.github.com/en/rest/issues/issues#list-repository-issues */
export type GithubRestIssuesListForRepoResponse = RestEndpointMethodTypes["issues"]["listForRepo"]["response"];
