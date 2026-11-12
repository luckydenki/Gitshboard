import type { CommonErrorResponse } from "../types/middlewares/common";
import CommonError from "../utils/common-error";
import { GithubGraphqlFetch } from "./repo.client";
import { userCommitActivityQuery } from "./queries/github/user-commit-activity.query";
import type {
    GetCommitActivityQuery,
    GetCommitActivityQueryVariables,
} from "../types/github/graphql/operations.generated";

class ContributionClient {
    /**
     * commitActivity를 가져오는 함수
     *
     *
     * @param githubAccessToken
     * @param username
     * @param from  
     * @param to
     *
     * 참고로 from과 to는 Date 객체를 ISO 8601 형식의 문자열로 변환하여 전달해야 합니다. 예: '2023-01-01T00:00:00Z'
     *
     * Date내부 메서드 중 toISOString()를 사용하면 ISO 8601 형식의 문자열을 얻을 수 있습니다.
     *
     * @returns
     */
    public getCommitActivity = async (
        githubAccessToken: string | undefined,
        username: string,
        from: string,
        to: string,
    ): Promise<NonNullable<GetCommitActivityQuery["user"]>> => {
        try {
            const variables = {
                username,
                from,
                to,
            } satisfies GetCommitActivityQueryVariables;
            console.log(`Fetching commit activity for user: ${username}, from: ${from}, to: ${to}`);

            const response = await GithubGraphqlFetch<GetCommitActivityQuery>(
                githubAccessToken,
                userCommitActivityQuery,
                variables,
            );

            if (response?.user) {
                return response.user;
            } else {
                const errorResponse: CommonErrorResponse = CommonError.create400Error(
                    "Failed to fetch commit activity from GitHub API",
                );
                throw errorResponse;
            }
        } catch (error) {
            console.error("Failed to fetch commit activity from GitHub API", error);

            if (error instanceof Error) {
                const errorResponse: CommonErrorResponse = CommonError.create500Error(
                    error.message,
                );
                throw errorResponse;
            }

            throw error;
        }
    };
}

const contributionClient = new ContributionClient();
export default contributionClient;
