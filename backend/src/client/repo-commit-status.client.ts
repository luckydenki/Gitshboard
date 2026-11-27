import { GithubGraphqlFetch } from "./repo.client";
import {
    repoCommitStatusPageInfoQuery,
    repoCommitStatusQuery,
} from "./queries/github/repo-commit-status.query";
import type {
    GithubGQLGetRepoCommitStatusPageInfoQuery,
    GithubGQLGetRepoCommitStatusQuery,
    GithubGQLGetRepoCommitStatusQueryVariables,
} from "../types/github/graphql/operations.generated";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";

/** GitHub의 기본 브랜치 커밋 이력을 조회합니다. */
class GithubRepoCommitStatusClient {
    public async getPage(
        variables: GithubGQLGetRepoCommitStatusQueryVariables,
        token?: string,
    ): Promise<GithubGQLGetRepoCommitStatusQuery> {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoCommitStatusQuery>(
                token,
                repoCommitStatusQuery,
                variables,
            );
        } catch (error) {
            if (error instanceof CommonError) throw error;
            if (RepoUtils.isRepositoryNotFound(error))
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            const status =
                error instanceof Error && "status" in error ? Number(error.status) : undefined;
            if (status === 401) throw CommonError.create401Error("GitHub 인증이 필요합니다.");
            if (status === 403 || status === 429) {
                throw new CommonError({
                    status,
                    title: status === 429 ? "Too Many Requests" : "Forbidden",
                    type: "https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api",
                    detail:
                        status === 429
                            ? "GitHub 조회 제한으로 잠시 후 다시 시도해 주세요."
                            : "저장소 접근 권한 또는 GitHub 조회 제한을 확인해 주세요.",
                });
            }
            throw CommonError.create500Error("GitHub 커밋 이력을 조회하지 못했습니다.");
        }
    }

    public async getCursor(variables: GithubGQLGetRepoCommitStatusQueryVariables, token?: string) {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoCommitStatusPageInfoQuery>(
                token,
                repoCommitStatusPageInfoQuery,
                variables,
            );
        } catch (error) {
            if (error instanceof CommonError) throw error;
            if (RepoUtils.isRepositoryNotFound(error))
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            const status =
                error instanceof Error && "status" in error ? Number(error.status) : undefined;
            if (status === 401) throw CommonError.create401Error("GitHub 인증이 필요합니다.");
            if (status === 403 || status === 429) {
                throw new CommonError({
                    status,
                    title: status === 429 ? "Too Many Requests" : "Forbidden",
                    type: "https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api",
                    detail:
                        status === 429
                            ? "GitHub 조회 제한으로 잠시 후 다시 시도해 주세요."
                            : "저장소 접근 권한 또는 GitHub 조회 제한을 확인해 주세요.",
                });
            }
            throw CommonError.create500Error("GitHub 커밋 이력을 조회하지 못했습니다.");
        }
    }
}

export default new GithubRepoCommitStatusClient();
