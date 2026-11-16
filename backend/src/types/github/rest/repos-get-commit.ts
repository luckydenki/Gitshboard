import type { RestEndpointMethodTypes } from "@octokit/rest";

/** A GitHub commit and its changed paths. link : https://docs.github.com/en/rest/commits/commits#get-a-commit */
export type GithubReposGetCommitDto = RestEndpointMethodTypes["repos"]["getCommit"]["response"]["data"];
