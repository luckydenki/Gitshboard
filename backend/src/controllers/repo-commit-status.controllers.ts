import type { Response } from "express";
import repoCommitStatusService from "../services/repo-commit-status.services";
import type { GetRepoCommitStatusOverviewData, GetRepoCommitStatusRecordsData } from "../types/controllers/repo-commit-status";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import CommonError from "../utils/common-error";

/** 저장소 커밋 현황의 요청과 응답을 처리합니다. */
class RepoCommitStatusControllers {
    public overview = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { timezone } = req.query;
        res.set("Cache-Control", "private, no-store");
        try {
            const data = await repoCommitStatusService.getOverview({ owner, repo, timezone,
                token: req.user?.githubAccessToken });
            const commonResponse: CommonResponse<GetRepoCommitStatusOverviewData> = { success: true, status: 200, data };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse = error instanceof CommonError ? error
                : CommonError.create500Error("커밋 현황을 불러오지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };

    public records = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { timezone, scope } = req.query;
        res.set("Cache-Control", "private, no-store");
        try {
            const data = await repoCommitStatusService.getRecords({ owner, repo, timezone, scope,
                token: req.user?.githubAccessToken });
            const commonResponse: CommonResponse<GetRepoCommitStatusRecordsData> = { success: true, status: 200, data };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse = error instanceof CommonError ? error
                : CommonError.create500Error("커밋 전적을 불러오지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };
}

export default new RepoCommitStatusControllers();
