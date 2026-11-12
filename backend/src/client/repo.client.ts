import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { repoLanguagesQuery } from "./queries/github/repo-languages.query";
import { repoCommitTimesQuery } from "./queries/github/repo-commit-times.query";
import { repoProjectTopicsQuery } from "./queries/github/repo-project-topics.query";
import { repoDeveloperProfileQuery } from "./queries/github/repo-developer-profile.query";
import { repoProjectHealthQuery } from "./queries/github/repo-project-health.query";
import type {
    GetRepoLanguagesQuery,
    GetRepoLanguagesQueryVariables,
    GetCommitTimesQuery,
    GetCommitTimesQueryVariables,
    GetProjectTopicsQuery,
    GetProjectTopicsQueryVariables,
    GetDevelopTimeQuery,
    GetDevelopTimeQueryVariables,
    GetProjectLiveRateQuery,
    GetProjectLiveRateQueryVariables,
} from "../types/github/graphql/operations.generated";
dotenv.config();

//이제 옥토킷에서 냅다 던져주는 방식인데, 옥토킷 graphql은 별다른 거 없이 data T와 또는 에러만 던집니다!
export const GithubGraphqlFetch = async <T>(
    githubAccessToken: string | undefined,
    query: string,
    variables: Record<string, unknown>,
): Promise<T> => {
    const auth = githubAccessToken || process.env.PUBLIC_API_TOKEN;

    if (githubAccessToken) console.log("github Access Token으로 API 호출 중");
    else console.warn("일반 pat token으로 호출 중");

    try {
        const octokit = new Octokit({ auth });
        return await octokit.graphql<T>(query, variables);
    } catch (error) {
        const status = error instanceof Error && "status" in error ? error.status : undefined;
        console.error("GraphQL 요청 실패", error);
        throw error;
    }
};

class GithubRepoAPIClient {
    public getLanguages = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ): Promise<GetRepoLanguagesQuery | null> => {
        const variables = { login: githubUsername } satisfies GetRepoLanguagesQueryVariables;

        try {
            const response = await GithubGraphqlFetch<GetRepoLanguagesQuery>(
                githubAccessToken,
                repoLanguagesQuery,
                variables,
            );
            return response.user ? response : null;
        } catch (error) {
            console.error("Failed to fetch languages from GitHub API", error);
            return null;
        }
    };

    public getCommitTime = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ): Promise<GetCommitTimesQuery | null> => {
        const variables = { login: githubUsername } satisfies GetCommitTimesQueryVariables;

        try {
            const response = await GithubGraphqlFetch<GetCommitTimesQuery>(
                githubAccessToken,
                repoCommitTimesQuery,
                variables,
            );
            return response.user ? response : null;
        } catch (error) {
            console.error("Failed to fetch commit times from GitHub API", error);
            return null;
        }
    };

    public getProjectTopics = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ): Promise<GetProjectTopicsQuery | null> => {
        const variables = { login: githubUsername } satisfies GetProjectTopicsQueryVariables;

        try {
            const response = await GithubGraphqlFetch<GetProjectTopicsQuery>(
                githubAccessToken,
                repoProjectTopicsQuery,
                variables,
            );
            return response.user ? response : null;
        } catch (error) {
            console.error("Failed to fetch project topics from GitHub API", error);
            return null;
        }
    };

    public getDevelopStats = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ): Promise<GetDevelopTimeQuery | null> => {
        const variables = { login: githubUsername } satisfies GetDevelopTimeQueryVariables;

        try {
            const response = await GithubGraphqlFetch<GetDevelopTimeQuery>(
                githubAccessToken,
                repoDeveloperProfileQuery,
                variables,
            );
            return response.user ? response : null;
        } catch (error) {
            console.error("Failed to fetch develop stats from GitHub API", error);
            return null;
        }
    };

    public getProjectLiveRate = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ): Promise<GetProjectLiveRateQuery | null> => {
        const variables = { login: githubUsername } satisfies GetProjectLiveRateQueryVariables;

        try {
            const response = await GithubGraphqlFetch<GetProjectLiveRateQuery>(
                githubAccessToken,
                repoProjectHealthQuery,
                variables,
            );
            return response.user ? response : null;
        } catch (error) {
            console.error("Failed to fetch project live rate from GitHub API", error);
            return null;
        }
    };
}

const githubRepoAPIClient = new GithubRepoAPIClient();
export default githubRepoAPIClient;
