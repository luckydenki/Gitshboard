import type { RestEndpointMethodTypes } from "@octokit/rest";

/** 브랜치에서 도달 가능한 커밋 목록입니다. link : https://docs.github.com/en/rest/commits/commits#list-commits */
export type GithubRestReposListCommitsResponse = RestEndpointMethodTypes["repos"]["listCommits"]["response"];
