import { CommitContributionActivity } from "../client/contribution.client";
import contributionClient from "../client/contribution.client";
import { redisClient } from "../infra/redis/redisClient";
import CommonError from "../utils/common-error";
import { getGithubCommitActivity } from "../utils/contribution";




class ContributionService {



    public getCommitActivity = async (githubAccessToken: string | undefined, githubUsername: string | undefined, from: string, to: string) => {

        try {
            if(from > to){
                throw new CommonError (
                    {
                        status : 400,
                        title : "Bad Request",
                        type : "https://docs.github.com/en/graphql/overview/explorer",
                        detail : "The 'from' date must be earlier than the 'to' date.",
                        instance: "/graphql"
                    }
                )
            }

            const cachedData = await redisClient.get(`commitActivity:${githubUsername}:${from}-${to}`);
            if (cachedData) {
                console.log("Serving cached commit activity data");
                return JSON.parse(cachedData);
            }

            if (!githubUsername) {
                console.error("Missing required query parameter: username");
                throw new CommonError({
                    status: 400,
                    title: "Bad Request",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "Missing required query parameter: username",
                    instance: "/graphql"
                });
            }
            const data: CommitContributionActivity = await contributionClient.getCommitActivity(githubAccessToken, githubUsername, from, to);
            const githubCommitActivity = getGithubCommitActivity(data);

            //redis의 fromto는 yyyymmdd만 사용한다.
            const redisFrom = from.split("T")[0].replace(/-/g, '');
            const redisTo = to.split("T")[0].replace(/-/g, '');
            redisClient.setEx(`commitActivity:${githubUsername}:${redisFrom}${redisTo}`, 60 * 60, JSON.stringify(githubCommitActivity)); // 캐시 만료 시간: 1시간

            return githubCommitActivity;

        }
        catch (error) {
            console.error("Error in /commitActivity route:", error);

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
                throw new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "GitHub API Error",
                    status: 500,
                    detail: "An unexpected error occurred",
                    instance: "/graphql"
                });
            }
        }

    }
}


const contributionService = new ContributionService();
export default contributionService;