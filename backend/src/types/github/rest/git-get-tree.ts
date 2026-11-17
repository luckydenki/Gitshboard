import type { RestEndpointMethodTypes } from "@octokit/rest";

/** 저장소의 Git 트리입니다. link : https://docs.github.com/en/rest/git/trees#get-a-tree */
export type GithubRestGitGetTreeResponse = RestEndpointMethodTypes["git"]["getTree"]["response"]["data"];
