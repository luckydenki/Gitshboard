import GithubRepoPopularIssuesClient from "../client/repo-popular-issues.client";
import {
    collectGraphqlPopularIssues,
    collectRestPopularIssues,
} from "./repo-popular-issues.collection";

/** 대상 저장소의 공개 여부를 확인한 뒤 토큰에 맞는 조회 경로를 사용합니다. */
export async function getPopularIssues(owner: string, repo: string, userToken?: string) {
    const asOf = new Date();
    const fallback = process.env.PUBLIC_API_TOKEN;
    const token = userToken ?? fallback;
    const client = new GithubRepoPopularIssuesClient(owner, repo, token);
    if (!userToken && fallback) await client.verifyPublicRepository();
    return token
        ? collectGraphqlPopularIssues(client, token, asOf)
        : collectRestPopularIssues(client, asOf);
}
