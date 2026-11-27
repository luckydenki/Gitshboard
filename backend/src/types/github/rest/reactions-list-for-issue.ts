import type { RestEndpointMethodTypes } from "@octokit/rest";
/** Issue 반응 목록. link : https://docs.github.com/en/rest/reactions/reactions#list-reactions-for-an-issue */
export type GithubRestReactionsListForIssueResponse =
    RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"];
