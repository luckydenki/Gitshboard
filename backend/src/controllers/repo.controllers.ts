import { AuthRequest } from "../types/middlewares/auth";
import { Response } from "express";
import { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import repoService from "../services/repo.services";
import type { GetRepoActivitySummaryDto } from "../types/response/repo-activity-summary";
import type { GetRepoActivityDto } from "../types/response/repo-activity";
import CommonError from "../utils/common-error";

class RepoController {
    public activity = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { timezone = "Asia/Seoul", limit = "6", cursor } = req.query;
        res.set("Cache-Control", "private, no-store");

        try {
            if (
                typeof owner !== "string" || !/^[\w-]+$/.test(owner) ||
                typeof repo !== "string" || !/^[\w.-]+$/.test(repo) ||
                typeof timezone !== "string" || timezone.length > 100 ||
                typeof limit !== "string" || !/^(?:[1-9]|1\d|20)$/.test(limit)
            ) {
                throw CommonError.create400Error("저장소 주소, 시간대 또는 페이지 크기를 확인해 주세요.");
            }

            const data = await repoService.getActivity({
                owner, repo, timezone, limit: Number(limit), cursor,
                token: req.user?.githubAccessToken || undefined,
            });
            const commonResponse: CommonResponse<GetRepoActivityDto> = { success: true, status: 200, data };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse = error instanceof CommonError
                ? error
                : CommonError.create500Error("GitHub 저장소 활동을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };

    public activitySummary = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { timezone = "Asia/Seoul" } = req.query;
        res.set("Cache-Control", "private, no-store");

        try {
            if (
                typeof owner !== "string" || !/^[\w-]+$/.test(owner) ||
                typeof repo !== "string" || !/^[\w.-]+$/.test(repo) ||
                typeof timezone !== "string" || timezone.length > 100
            ) {
                throw CommonError.create400Error("저장소 주소 또는 시간대를 확인해 주세요.");
            }

            const data = await repoService.getActivitySummary({
                owner, repo, timezone,
                token: req.user?.githubAccessToken || undefined,
            });
            const commonResponse: CommonResponse<GetRepoActivitySummaryDto> = { success: true, status: 200, data };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse = error instanceof CommonError
                ? error
                : CommonError.create500Error("GitHub 저장소 활동을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };
}

const repoController = new RepoController();
export default repoController;
