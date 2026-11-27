import type { GithubAppsCheckTokenDto } from "../github/rest/apps-check-token";

export type GetAuthGithubScopesDto = Pick<GithubAppsCheckTokenDto, "scopes">;
