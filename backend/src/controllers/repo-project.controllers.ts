import type { Response } from "express";
import service from "../services/repo-project.services";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import CommonError from "../utils/common-error";

class RepoProjectControllers {
    private handle<T>(load: (request: { owner: unknown; repo: unknown; token?: string }) => Promise<T>) {
        return async (req: AuthRequest, res: Response) => {
            const { owner, repo } = req.params;
            res.set("Cache-Control", "private, no-store");
            try {
                const data = await load({ owner, repo, token: req.user?.githubAccessToken });
                const commonResponse: CommonResponse<T> = { success: true, status: 200, data };
                res.json(commonResponse);
            } catch (error) {
                const errorResponse: CommonErrorResponse = error instanceof CommonError
                    ? error
                    : CommonError.create500Error("프로젝트 현황을 불러오지 못했습니다.");
                res.status(errorResponse.status).json(errorResponse);
            }
        };
    }

    public overview = this.handle((request) => service.getOverview(request));
    public files = this.handle((request) => service.getFiles(request));
    public branches = this.handle((request) => service.getBranches(request));
    public history = this.handle((request) => service.getHistory(request));
    public participation = this.handle((request) => service.getParticipation(request));
    public deployments = this.handle((request) => service.getDeployments(request));
}

export default new RepoProjectControllers();
