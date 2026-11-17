import type { RestEndpointMethodTypes } from "@octokit/rest";

/** 변경 불가능한 SHA의 Git blob입니다. link : https://docs.github.com/en/rest/git/blobs#get-a-blob */
export type GithubRestGitGetBlobResponse = RestEndpointMethodTypes["git"]["getBlob"]["response"]["data"];
