import {
    GithubLanguageRepositoryNode,
    GithubRepoCommonResponse,
    GithubCommitTimeRepositoryNode,
    GithubProjectTopicsNode,
    ProjectLiveRateNode,
} from "../types/stat";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { repoLanguagesQuery } from "./queries/github/repo-languages.query";
import type {
    GetRepoLanguagesQuery,
    GetRepoLanguagesQueryVariables,
} from "../types/github/graphql/operations.generated";
dotenv.config();

export const GithubGraphqlFetch = async <T>(
    githubAccessToken: string | undefined,
    query: string,
    variables: Record<string, unknown>,
): Promise<T> => {
    const auth = githubAccessToken || process.env.PUBLIC_API_TOKEN;
    const octokit = new Octokit({ auth });
    return octokit.graphql<T>(query, variables);
};

class GithubRepoAPIClient {
    public getLanguages = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ): Promise<GithubRepoCommonResponse<GithubLanguageRepositoryNode> | null> => {
        const variables = {
            login: githubUsername,
        } satisfies GetRepoLanguagesQueryVariables;

        try {
            const { user } = await GithubGraphqlFetch<GetRepoLanguagesQuery>(
                githubAccessToken,
                repoLanguagesQuery,
                variables,
            );
            if (!user) return null;

            const nodes = (user.repositories.nodes ?? []).flatMap((repository) => {
                if (!repository?.languages) return [];

                return [
                    {
                        name: repository.name,
                        languages: {
                            totalSize: repository.languages.totalSize,
                            edges: (repository.languages.edges ?? []).filter((edge) => edge !== null),
                        },
                    },
                ];
            });

            return { user: { repositories: { nodes } } };
        } catch (error) {
            console.error("Failed to fetch languages from GitHub API", error);
            return null;
        }
    };

    public getCommitTime = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        const query = `
            query GetCommitTimes($login : String!){
                user(login : $login){
                    repositories(first : 20){
                        nodes{
                            name
                            defaultBranchRef{
                                target{
                                    ... on Commit{
                                        history(first:50){
                                            nodes {
                                                committedDate
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }   
            }
        `;

        const variables = {
            login: githubUsername,
        };

        try {
            const github_response = await GithubGraphqlFetch(githubAccessToken, query, variables);

            if (github_response.ok) {
                const githubData = await github_response.json();
                const userData: GithubRepoCommonResponse<GithubCommitTimeRepositoryNode> =
                    githubData.data;
                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch commit times from GitHub API", error);
            return null;
        }
    };

    public getProjectTopics = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        //graphql query에서 String! 이라 되어있는건 String 만 가능하다는 것
        //!를 제거하면 String | null 이므로 null 도 허용된다
        const query = `
                    query GetProjectTopics($login : String!){
                        user(login : $login){
                            repositories(first : 20){
                                nodes {
                                    name
                                    repositoryTopics(first : 20){
                                        nodes {
                                            topic {
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;

        const variables = {
            login: githubUsername,
        };
        try {
            const github_response = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    Authorization: `token ${githubAccessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            if (github_response.ok) {
                const githubData = await github_response.json();
                const userData: GithubRepoCommonResponse<GithubProjectTopicsNode> = githubData.data;

                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch project topics from GitHub API", error);
            return null;
        }
    };

    public getDevelopStats = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        const query = `
            query GetDevelopTime($login : String!){
                user(login : $login){
                    repositories(first : 20){
                        nodes {
                            defaultBranchRef{
                                target{
                                    ... on Commit{
                                        history(first : 30){
                                            nodes{
                                                committedDate    
                                            }
                                        }
                                    }
                                }
                            }
                            languages(first : 20){
                                edges{
                                    node{
                                        name
                                    }
                                }
                            }
                            repositoryTopics(first : 20){
                                nodes{
                                    topic{
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            login: githubUsername,
        };
        try {
            const github_response = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    Authorization: `token ${githubAccessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            if (github_response.ok) {
                const githubData = await github_response.json();
                const userData: GithubRepoCommonResponse<
                    GithubCommitTimeRepositoryNode &
                        GithubLanguageRepositoryNode &
                        GithubProjectTopicsNode
                > = githubData.data;
                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch develop stats from GitHub API", error);
            return null;
        }
    };

    public getProjectLiveRate = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        const query = `
                query getProjectLiveRate($login : String!){
                    user(login : $login){
                        repositories(first : 20){
                            nodes{
                                createdAt
                                updatedAt
                                pushedAt
                                isArchived
                                isFork
                                name
                            }   
                        }
                    }
                }
            `;

        const variables = {
            login: githubUsername,
        };

        try {
            const github_response = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    Authorization: `token ${githubAccessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            if (github_response.ok) {
                const githubData = await github_response.json();
                const userData: GithubRepoCommonResponse<ProjectLiveRateNode> = githubData.data;
                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch project live rate from GitHub API", error);
            return null;
        }
    };
}

const githubRepoAPIClient = new GithubRepoAPIClient();
export default githubRepoAPIClient;
