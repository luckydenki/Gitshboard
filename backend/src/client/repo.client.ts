import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import type { GithubReposGetCommitDto } from "../types/github/rest/repos-get-commit";
import CommonError from "../utils/common-error";
import { githubRepoActivityQuery } from "./queries/github/repo-activity.query";
import { repoLanguagesQuery } from "./queries/github/repo-languages.query";
import { repoCommitTimesQuery } from "./queries/github/repo-commit-times.query";
import type {
    RepoActivityQuery,
    RepoActivityQueryVariables,
    GetRepoLanguagesQuery,
    GetRepoLanguagesQueryVariables,
    GetCommitTimesQuery,
    GetCommitTimesQueryVariables,
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

class GithubRepoClient {
    public getActivityPage = async (
        variables: RepoActivityQueryVariables,
        githubAccessToken?: string,
    ): Promise<RepoActivityQuery> => {
        try {
            return await GithubGraphqlFetch<RepoActivityQuery>(
                githubAccessToken,
                githubRepoActivityQuery,
                variables,
            );
        } catch (error) {
            if (error instanceof CommonError) throw error;

            const notFound = error instanceof Error && "errors" in error && Array.isArray(error.errors) &&
                error.errors.some((item) => item?.type === "NOT_FOUND" && item.path?.[0] === "repository");
            if (notFound) throw CommonError.create404Error("저장소를 찾을 수 없습니다.");

            throw CommonError.create500Error("GitHub 저장소 활동을 조회하지 못했습니다.");
        }
    };

    public getActivityCommit = async (
        owner: string,
        repo: string,
        sha: string,
        githubAccessToken?: string,
    ): Promise<GithubReposGetCommitDto> => {
        try {
            const octokit = new Octokit({ auth: githubAccessToken ?? process.env.PUBLIC_API_TOKEN });
            const { data: response } = await octokit.rest.repos.getCommit({ owner, repo, ref: sha, per_page: 1 });
            return response;
        } catch (error) {
            if (error instanceof CommonError) throw error;
            if (error instanceof Error && "status" in error && error.status === 404) {
                throw CommonError.create404Error("GitHub 커밋을 찾을 수 없습니다.");
            }
            throw CommonError.create500Error("GitHub 커밋 상세 정보를 조회하지 못했습니다.");
        }
    };

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
}

const githubRepoAPIClient = new GithubRepoClient();
export default githubRepoAPIClient;
