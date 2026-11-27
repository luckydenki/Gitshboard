import contributionService from "../services/contribution.services";
import { AuthRequest } from "../types/middlewares/auth";
import { CommonResponse } from "../types/middlewares/common";
import { Response } from "express";

class ContributionController {
    public getCommitActivity = async (req: AuthRequest, res: Response) => {
        res.set("Cache-Control", "private, no-store");
        try {
            const username = req.params.login as string;
            const { from, to } = req.query;
            if (
                !/^[a-z\d][a-z\d-]{0,38}$/i.test(username) ||
                typeof from !== "string" ||
                typeof to !== "string" ||
                !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
                    from,
                ) ||
                !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(to) ||
                !Number.isFinite(Date.parse(from)) ||
                !Number.isFinite(Date.parse(to)) ||
                Date.parse(from) > Date.parse(to)
            ) {
                return res
                    .status(400)
                    .json({
                        status: 400,
                        title: "Bad Request",
                        detail: "유효한 사용자 이름과 ISO 8601 날짜 범위가 필요합니다.",
                    });
            }

            const data = await contributionService.getCommitActivity(
                req.user?.githubAccessToken,
                username,
                from,
                to,
                true,
            );

            //typeof data -> data의 타입이 꽤 자주 변할 수가 있기 때문에 의존성을 줄이려고 의도적으로 사용함.
            const response: CommonResponse<typeof data> = {
                success: true,
                status: 200,
                data: data,
            };

            // console.log("contribute data", data);
            res.status(200).json(response);
        } catch (error: any) {
            console.error("Error in /commitActivity route:", error);

            if (error instanceof Error) {
                const errorResponse = {
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "GitHub API Error",
                    status: 500,
                    detail: error.message,
                    instance: "/graphql",
                };
                return res.status(500).json(errorResponse);
            } else if ("status" in error) {
                return res.status(error.status).json(error);
            } else {
                const errorResponse = {
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "GitHub API Error",
                    status: 500,
                    detail: "알 수 없는 오류가 발생했습니다.",
                    instance: "/graphql",
                };
                return res.status(500).json(errorResponse);
            }
        }
    };
}

const contributionController = new ContributionController();
export default contributionController;
