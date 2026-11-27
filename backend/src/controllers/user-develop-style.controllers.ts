import type { Request, Response } from "express";
import type { CommonResponse, CommonErrorResponse } from "../types/middlewares/common";
import type { UserDevelopStyle } from "../types/response/user-develop-style";
import UserDevelopStyleServices from "../services/user-develop-style.services";
import CommonError from "../utils/common-error";
export default class UserDevelopStyleControllers {
    private services = new UserDevelopStyleServices();
    public getOverview = async (req: Request, res: Response) => {
        const { login } = req.params;
        const { timezone = "Asia/Seoul" } = req.query;
        try {
            const data = await this.services.getOverview(login, timezone, Object.keys(req.query));
            const commonResponse: CommonResponse<UserDevelopStyle> = {
                status: 200,
                success: true,
                data,
            };
            res.set("Cache-Control", "public, max-age=300").json(commonResponse);
        } catch (error) {
            const commonResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : {
                          status: 500,
                          type: "Server Error",
                          title: "개발 성향 정보를 처리하지 못했습니다.",
                          instance: req.originalUrl,
                      };
            res.status(commonResponse.status).json(commonResponse);
        }
    };
}
