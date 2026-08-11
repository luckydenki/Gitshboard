import contributionClient, { CommitContributionActivity } from "../client/contribution.client";
import contributionService from "../services/contribution.services";
import { AuthRequest } from "../types/middlewares/auth";
import { CommonResponse } from "../types/middlewares/common";
import { Response } from "express";



class ContributionController {


    public getCommitActivity = async (req: AuthRequest, res : Response) => {

        try {
            const github_token = req.user?.githubAccessToken
            const username = req.user?.githubUsername
            const from = req.query.from as string;
            const to = req.query.to as string;


            const data = await contributionService.getCommitActivity(github_token, username, from, to);


            //typeof data -> data의 타입이 꽤 자주 변할 수가 있기 때문에 의존성을 줄이려고 의도적으로 사용함.
            const response: CommonResponse<typeof data> = {
                success: true,
                status: 200,
                data: data
            }

            console.log("contribute data", data);
            res.status(200).json(response);

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
                return res.status(500).json(errorResponse);
            }

            return res.status(500).json(error);
        }

    }
}



const contributionController = new ContributionController();
export default contributionController;