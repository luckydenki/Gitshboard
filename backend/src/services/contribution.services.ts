import contributionClient from "../client/contribution.client";
import { redisClient } from "../infra/redis/redisClient";
import { GithubCommitActivity } from "../types/contribution";
import CommonError from "../utils/common-error";
import { getGithubCommitActivity } from "../utils/contribution.util";

const errorHandler = (error: unknown) => {
    if (error instanceof CommonError) {
        throw error;
    } else if (error instanceof Error) {
        throw new CommonError({
            type: "https://docs.github.com/en/graphql/overview/explorer",
            title: "GitHub API Error",
            status: 500,
            detail: error.message,
            instance: "/graphql",
        });
    } else {
        throw error;
    }
};

class ContributionService {
    public getCommitActivity = async (
        githubAccessToken: string | undefined,
        githubUsername: string | undefined,
        from: string,
        to: string,
        publicCache = false,
    ) => {
        try {
            if (Date.parse(from) > Date.parse(to)) {
                throw CommonError.create400Error(
                    "The 'from' date must be earlier than the 'to' date.",
                    "/graphql",
                );
            }

            //redis의 fromto는 yyyymmdd만 사용한다.
            const redisFrom = from.split("T")[0].replace(/-/g, "");
            const redisTo = to.split("T")[0].replace(/-/g, "");
            const cacheKey = publicCache
                ? `publicCommitActivity:${githubUsername?.toLowerCase()}:${from}:${to}`
                : `commitActivity:${githubUsername}:${redisFrom}${redisTo}`;
            // 사용자 토큰의 권한에 따라 결과가 달라지므로 공용 캐시를 사용하지 않는다.
            const useCache = !(publicCache && githubAccessToken);
            const cachedData = useCache ? await redisClient.get(cacheKey) : null;
            if (cachedData) {
                console.log("Serving cached commit activity data");
                return JSON.parse(cachedData) as GithubCommitActivity;
            }

            if (!githubUsername) {
                console.error("Missing required query parameter: username");
                throw CommonError.create400Error(
                    "Missing required query parameter: username",
                    "/graphql",
                );
            }
            const data = await contributionClient.getCommitActivity(
                githubAccessToken,
                githubUsername,
                from,
                to,
            );
            const githubCommitActivity = getGithubCommitActivity(data);

            if (useCache) {
                redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(githubCommitActivity));
            }

            return githubCommitActivity;
        } catch (error) {
            errorHandler(error);
        }
    };
}

const contributionService = new ContributionService();
export default contributionService;
