import type { RestEndpointMethodTypes } from "@octokit/rest";
/** link : https://docs.github.com/en/rest/repos/repos#list-repository-contributors */
export type GithubRestReposListContributorsResponse =
    RestEndpointMethodTypes["repos"]["listContributors"]["response"]["data"];
/** link : https://docs.github.com/en/rest/releases/releases#list-releases */
export type GithubRestReposListReleasesResponse =
    RestEndpointMethodTypes["repos"]["listReleases"]["response"]["data"];
