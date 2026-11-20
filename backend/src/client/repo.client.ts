import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import type { GithubReposDto } from "../types/services/repo";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";
import { githubGetRepoActivityBranchesQuery } from "./queries/github/repo-activity-branches.query";
import { githubGetRepoActivityQuery } from "./queries/github/repo-activity.query";
import { repositoryDashboardProfileQuery } from "./queries/github/repository-dashboard-profile.query";
import { repoLanguagesQuery } from "./queries/github/repo-languages.query";
import { repoCommitTimesQuery } from "./queries/github/repo-commit-times.query";
import type {
    GithubGQLGetRepoActivityQuery,
    GithubGQLGetRepoActivityQueryVariables,
    GithubGQLGetRepoActivityBranchesQuery,
    GithubGQLGetRepoActivityBranchesQueryVariables,
    GithubGQLGetRepositoryDashboardProfileQuery as GetRepositoryDashboardProfileQuery,
    GithubGQLGetRepositoryDashboardProfileQueryVariables as GetRepositoryDashboardProfileQueryVariables,
    GithubGQLGetRepoLanguagesQuery as GetRepoLanguagesQuery,
    GithubGQLGetRepoLanguagesQueryVariables as GetRepoLanguagesQueryVariables,
    GithubGQLGetCommitTimesQuery as GetCommitTimesQuery,
    GithubGQLGetCommitTimesQueryVariables as GetCommitTimesQueryVariables,
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
    /** 기본 브랜치와 저장소 접근 가능 여부를 조회합니다. */
    public getReadmeRepository = async (owner: string, repo: string, token?: string) => {
        const octokit = new Octokit({ auth: token ?? process.env.PUBLIC_API_TOKEN });
        const { data: response } = await octokit.rest.repos.get({ owner, repo });
        return response;
    };

    /** 기본 브랜치의 전체 파일 트리를 조회합니다. */
    public getReadmeTree = async (owner: string, repo: string, branch: string, token?: string) => {
        const octokit = new Octokit({ auth: token ?? process.env.PUBLIC_API_TOKEN });
        const { data: response } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: branch,
            recursive: "true",
        });
        return response;
    };

    /** 선택한 README blob을 조회합니다. */
    public getReadmeBlob = async (owner: string, repo: string, sha: string, token?: string) => {
        const octokit = new Octokit({ auth: token ?? process.env.PUBLIC_API_TOKEN });
        const { data: response } = await octokit.rest.git.getBlob({ owner, repo, file_sha: sha });
        return response;
    };
    public getProfile = async (
        variables: GetRepositoryDashboardProfileQueryVariables,
        githubAccessToken?: string,
    ): Promise<GetRepositoryDashboardProfileQuery> => {
        try {
            return await GithubGraphqlFetch<GetRepositoryDashboardProfileQuery>(
                githubAccessToken,
                repositoryDashboardProfileQuery,
                variables,
            );
        } catch (error) {
            if (error instanceof CommonError) throw error;
            if (RepoUtils.isRepositoryNotFound(error))
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");

            throw CommonError.create500Error("저장소 프로필을 불러오지 못했습니다.");
        }
    };

    public getActivityPage = async (
        variables: GithubGQLGetRepoActivityQueryVariables,
        githubAccessToken?: string,
    ): Promise<GithubGQLGetRepoActivityQuery> => {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoActivityQuery>(
                githubAccessToken,
                githubGetRepoActivityQuery,
                variables,
            );
        } catch (error) {
            if (error instanceof CommonError) throw error;

            if (RepoUtils.isRepositoryNotFound(error))
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");

            throw CommonError.create500Error("GitHub 저장소 활동을 조회하지 못했습니다.");
        }
    };

    public getActivityBranches = async (
        variables: GithubGQLGetRepoActivityBranchesQueryVariables,
        githubAccessToken?: string,
    ): Promise<GithubGQLGetRepoActivityBranchesQuery> => {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoActivityBranchesQuery>(
                githubAccessToken,
                githubGetRepoActivityBranchesQuery,
                variables,
            );
        } catch (error) {
            if (error instanceof CommonError) throw error;
            if (RepoUtils.isRepositoryNotFound(error))
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            throw CommonError.create500Error("GitHub 브랜치 목록을 조회하지 못했습니다.");
        }
    };

    public getActivityCommit = async (
        owner: string,
        repo: string,
        sha: string,
        githubAccessToken?: string,
    ): Promise<GithubReposDto> => {
        try {
            const octokit = new Octokit({
                auth: githubAccessToken ?? process.env.PUBLIC_API_TOKEN,
            });
            const { data: response } = await octokit.rest.repos.getCommit({
                owner,
                repo,
                ref: sha,
                per_page: 1,
            });
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
