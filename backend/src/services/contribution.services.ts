import { CommitActivity } from "../client/contribution.client";
import contributionClient from "../client/contribution.client";





class ContributionService {



    public getCommitActivity = async (githubAccessToken: string | undefined, githubUsername: string | undefined, from: string, to: string) => {

        try {
            if (!githubAccessToken || !githubUsername) {
                throw new Error('인증된 사용자가 아닙니다.');
            }
            const data: CommitActivity = await contributionClient.getCommitActivity(githubAccessToken, githubUsername, from, to);
            return data;

        }
        catch (error) {
            console.error("Error in /commitActivity route:", error);

            if (error instanceof Error) {
                const errorResponse = {
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "GitHub API Error",
                    status: 500,
                    detail: error.message,
                    instance: "/graphql"
                }
                throw error;
            }

            throw error;
        }

    }
}


const contributionService = new ContributionService();
export default contributionService;