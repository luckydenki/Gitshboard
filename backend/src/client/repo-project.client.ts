import { Octokit } from "@octokit/rest";
import { GithubGraphqlFetch } from "./repo.client";
import { githubGetRepoProjectOverviewQuery } from "./queries/github/repo-project-overview.query";
import { githubGetRepoProjectBranchesQuery } from "./queries/github/repo-project-branches.query";
import type {
    GithubGQLGetRepoProjectOverviewQuery,
    GithubGQLGetRepoProjectOverviewQueryVariables,
    GithubGQLGetRepoProjectBranchesQuery,
    GithubGQLGetRepoProjectBranchesQueryVariables,
} from "../types/github/graphql/operations.generated";
import type { GithubRestGitGetTreeResponse } from "../types/github/rest/git-get-tree";
import type { GithubRestGitGetBlobResponse } from "../types/github/rest/git-get-blob";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";

class GithubRepoProjectClient {
    private fail(error: unknown, message: string): never {
        if (error instanceof CommonError) throw error;
        if (RepoUtils.isRepositoryNotFound(error) ||
            (error instanceof Error && "status" in error && error.status === 404)) {
            throw CommonError.create404Error("저장소 또는 Git 데이터를 찾을 수 없습니다.");
        }
        throw CommonError.create500Error(message);
    }

    public async getOverview(variables: GithubGQLGetRepoProjectOverviewQueryVariables, token?: string) {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoProjectOverviewQuery>(token, githubGetRepoProjectOverviewQuery, variables);
        } catch (error) {
            return this.fail(error, "프로젝트 개요를 조회하지 못했습니다.");
        }
    }

    public async getBranches(variables: GithubGQLGetRepoProjectBranchesQueryVariables, token?: string) {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoProjectBranchesQuery>(token, githubGetRepoProjectBranchesQuery, variables);
        } catch (error) {
            return this.fail(error, "프로젝트 브랜치를 조회하지 못했습니다.");
        }
    }

    public async getTree(owner: string, repo: string, sha: string, token?: string): Promise<GithubRestGitGetTreeResponse> {
        try {
            const octokit = new Octokit({ auth: token || process.env.PUBLIC_API_TOKEN });
            const { data: response } = await octokit.rest.git.getTree({ owner, repo, tree_sha: sha, recursive: "1" });
            return response;
        } catch (error) {
            return this.fail(error, "프로젝트 파일 트리를 조회하지 못했습니다.");
        }
    }

    public async getBlob(owner: string, repo: string, sha: string, token?: string): Promise<GithubRestGitGetBlobResponse> {
        try {
            const octokit = new Octokit({ auth: token || process.env.PUBLIC_API_TOKEN });
            const { data: response } = await octokit.rest.git.getBlob({ owner, repo, file_sha: sha });
            return response;
        } catch (error) {
            return this.fail(error, "프로젝트 설정 파일을 조회하지 못했습니다.");
        }
    }
}

export default new GithubRepoProjectClient();
