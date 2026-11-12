import type { RestEndpointMethodTypes } from "@octokit/rest";

/**
 * GitHub OAuth 토큰 검증의 원본 응답 본문입니다.
 * link : https://docs.github.com/en/rest/apps/oauth-applications#check-a-token
 */
export type GithubAppsCheckTokenDto =
    RestEndpointMethodTypes["apps"]["checkToken"]["response"]["data"];
