import { GithubGraphqlFetch } from "./repo.client";
import { githubGetRepoProjectDeploymentsQuery } from "./queries/github/repo-project-deployments.query";
import { githubGetRepoProjectDeploymentStatusesQuery } from "./queries/github/repo-project-deployment-statuses.query";
import type {
    GithubGQLGetRepoProjectDeploymentsQuery,
    GithubGQLGetRepoProjectDeploymentsQueryVariables,
    GithubGQLGetRepoProjectDeploymentStatusesQuery,
    GithubGQLGetRepoProjectDeploymentStatusesQueryVariables,
} from "../types/github/graphql/operations.generated";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";

class GithubRepoProjectDeploymentsClient {
    public async getDeployments(
        variables: GithubGQLGetRepoProjectDeploymentsQueryVariables,
        token?: string,
    ): Promise<GithubGQLGetRepoProjectDeploymentsQuery> {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoProjectDeploymentsQuery>(
                token,
                githubGetRepoProjectDeploymentsQuery,
                variables,
            );
        } catch (error) {
            if (RepoUtils.isRepositoryNotFound(error)) {
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            }
            throw CommonError.create500Error("GitHub 배포 목록을 가져오지 못했습니다.");
        }
    }

    public async getDeploymentStatuses(
        variables: GithubGQLGetRepoProjectDeploymentStatusesQueryVariables,
        token?: string,
    ): Promise<GithubGQLGetRepoProjectDeploymentStatusesQuery> {
        try {
            return await GithubGraphqlFetch<GithubGQLGetRepoProjectDeploymentStatusesQuery>(
                token,
                githubGetRepoProjectDeploymentStatusesQuery,
                variables,
            );
        } catch {
            throw CommonError.create500Error("GitHub 배포 상태 이력을 가져오지 못했습니다.");
        }
    }
}

export default new GithubRepoProjectDeploymentsClient();
