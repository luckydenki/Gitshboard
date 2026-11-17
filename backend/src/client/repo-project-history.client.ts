import { Octokit } from "@octokit/rest";
import type {
    GithubGitHistoryTreeDto,
    GithubIssuesHistoryDto,
    GithubReposHistoryCommitsDto,
    GithubReposHistoryMetadataDto,
} from "../types/services/repo-project-history";
import CommonError from "../utils/common-error";

function githubError(error: unknown, detail: string): CommonError {
    if (error instanceof CommonError) return error;
    if (error instanceof Error && "status" in error && error.status === 404) {
        return CommonError.create404Error("저장소 이력을 찾을 수 없습니다.");
    }
    return CommonError.create500Error(detail);
}

export default class GithubRepoProjectHistoryClient {
    private readonly octokit: Octokit;

    constructor(token?: string) {
        this.octokit = new Octokit({ auth: token || process.env.PUBLIC_API_TOKEN });
    }

    public async getRepository(owner: string, repo: string): Promise<GithubReposHistoryMetadataDto> {
        try {
            const { data } = await this.octokit.rest.repos.get({ owner, repo });
            return data;
        } catch (error) {
            throw githubError(error, "GitHub 저장소 정보를 불러오지 못했습니다.");
        }
    }

    public async listCommits(params: {
        owner: string;
        repo: string;
        sha: string;
        until?: string;
        page?: number;
        per_page: number;
    }): Promise<GithubReposHistoryCommitsDto | null> {
        try {
            return await this.octokit.rest.repos.listCommits(params);
        } catch (error) {
            if (error instanceof Error && "status" in error && error.status === 409) return null;
            throw githubError(error, "GitHub 커밋 이력을 불러오지 못했습니다.");
        }
    }

    public async getTree(owner: string, repo: string, sha: string): Promise<GithubGitHistoryTreeDto> {
        try {
            const { data } = await this.octokit.rest.git.getTree({
                owner, repo, tree_sha: sha, recursive: "1",
            });
            return data;
        } catch (error) {
            throw githubError(error, "GitHub 파일 이력을 불러오지 못했습니다.");
        }
    }

    public async listWorkItems(owner: string, repo: string, page: number): Promise<GithubIssuesHistoryDto> {
        try {
            return await this.octokit.rest.issues.listForRepo({
                owner, repo, page, per_page: 100, state: "all", sort: "created", direction: "desc",
            });
        } catch (error) {
            throw githubError(error, "GitHub 이슈·PR 이력을 불러오지 못했습니다.");
        }
    }
}
