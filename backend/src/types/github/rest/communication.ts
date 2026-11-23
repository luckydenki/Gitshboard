import type { RestEndpointMethodTypes } from "@octokit/rest";
/** link : https://docs.github.com/en/rest/commits/commits#list-commits */
export type GithubRestReposListCommitsResponse =
    RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"];
/** link : https://docs.github.com/en/rest/releases/releases#list-releases */
export type GithubRestReposListReleasesResponse =
    RestEndpointMethodTypes["repos"]["listReleases"]["response"]["data"];
