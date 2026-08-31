import { CommitContributionActivity } from "../client/contribution.client";
import contributionClient from "../client/contribution.client";
import { redisClient } from "../infra/redis/redisClient";
import CommonError from "../utils/common-error";
import { getGithubCommitActivity } from "../utils/contribution.util";


const errorHandler = (error: unknown) => {
    if(error instanceof CommonError){
        throw error;
    }
    else if (error instanceof Error) {
        throw new CommonError({
            type: "https://docs.github.com/en/graphql/overview/explorer",
            title: "GitHub API Error",
            status: 500,
            detail: error.message,
            instance: "/graphql"
        });
    }
    else{
        throw error;
    }
}




class ContributionService {

    public getCommitActivity = async (githubAccessToken: string | undefined, githubUsername: string | undefined, from: string, to: string) => {

        try {
            if(from > to){
                throw CommonError.create400Error(
                    "The 'from' date must be earlier than the 'to' date.", 
                    "/graphql");
            }

            //redis의 fromto는 yyyymmdd만 사용한다.
            const redisFrom = from.split("T")[0].replace(/-/g, '');
            const redisTo = to.split("T")[0].replace(/-/g, '');
            const cachedData = await redisClient.get(`commitActivity:${githubUsername}:${redisFrom}${redisTo}`);
            if (cachedData) {
                console.log("Serving cached commit activity data");
                return JSON.parse(cachedData);
            }

            if (!githubUsername) {
                console.error("Missing required query parameter: username");
                throw CommonError.create400Error("Missing required query parameter: username", "/graphql");
            }
            const data: CommitContributionActivity = await contributionClient.getCommitActivity(githubAccessToken, githubUsername, from, to);
            const githubCommitActivity = getGithubCommitActivity(data);

            redisClient.setEx(`commitActivity:${githubUsername}:${redisFrom}${redisTo}`, 60 * 60, JSON.stringify(githubCommitActivity)); // 캐시 만료 시간: 1시간

            return githubCommitActivity;

        }
        catch (error) {
            errorHandler(error);
        }
    }
}


const contributionService = new ContributionService();
export default contributionService;