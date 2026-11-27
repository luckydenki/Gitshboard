import type { RestEndpointMethodTypes } from "@octokit/rest";
/** 공개 이벤트. link : https://docs.github.com/en/rest/activity/events */
export type GithubRestActivityListPublicEventsForUserResponse =
    RestEndpointMethodTypes["activity"]["listPublicEventsForUser"]["response"]["data"];
/** 공개 저장소. link : https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user */
export type GithubRestReposListForUserResponse =
    RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"];
/** 언어별 코드 바이트. link : https://docs.github.com/en/rest/repos/repos#list-repository-languages */
export type GithubRestReposListLanguagesResponse =
    RestEndpointMethodTypes["repos"]["listLanguages"]["response"]["data"];
