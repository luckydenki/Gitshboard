import type { Response } from "express";
import repoService from "../services/repo.services";
import type {
    GetRepoReadmesData,
    GetRepoReadmeContentData,
    GetRepoActivityBranchesData,
    GetRepoActivityData,
    GetRepoActivitySummaryData,
    GetRepoHealthData,
    GetRepoProfileData,
} from "../types/controllers/repo";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import CommonError from "../utils/common-error";

class RepoControllers {
    public readmes = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        res.set("Cache-Control", "private, no-store");
        try {
            const data = await repoService.getReadmes(owner, repo, req.user?.githubAccessToken);
            const commonResponse: CommonResponse<GetRepoReadmesData> = {
                success: true,
                status: 200,
                data,
            };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : CommonError.create500Error("README 목록을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };

    public readmeContent = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { path } = req.query;
        res.set("Cache-Control", "private, no-store");
        try {
            const data = await repoService.getReadmeContent(
                owner,
                repo,
                path,
                req.user?.githubAccessToken,
            );
            const commonResponse: CommonResponse<GetRepoReadmeContentData> = {
                success: true,
                status: 200,
                data,
            };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : CommonError.create500Error("README 내용을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };
    public health = (_req: AuthRequest, res: Response<GetRepoHealthData>) => {
        res.json({ message: "Repo route is working!" });
    };

    public profile = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        res.set("Cache-Control", "private, no-store");

        try {
            const data = await repoService.getProfile({
                owner,
                repo,
                token: req.user?.githubAccessToken,
            });
            const commonResponse: CommonResponse<GetRepoProfileData> = {
                success: true,
                status: 200,
                data,
            };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : CommonError.create500Error("저장소 프로필을 불러오지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };

    public activityCommits = (req: AuthRequest, res: Response) =>
        this.activity(req, res, "commits");

    public activityPullRequestsIssues = (req: AuthRequest, res: Response) =>
        this.activity(req, res, "pull-requests-issues");

    private async activity(
        req: AuthRequest,
        res: Response,
        source: "commits" | "pull-requests-issues",
    ) {
        const { owner, repo } = req.params;
        const { timezone, limit, cursor, branch } = req.query;
        res.set("Cache-Control", "private, no-store");

        try {
            const data = await repoService.getActivity({
                owner,
                repo,
                timezone,
                limit,
                cursor,
                branch,
                source,
                token: req.user?.githubAccessToken,
            });
            const commonResponse: CommonResponse<GetRepoActivityData> = {
                success: true,
                status: 200,
                data,
            };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : CommonError.create500Error("GitHub 저장소 활동을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    public activityBranches = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { cursor } = req.query;
        res.set("Cache-Control", "private, no-store");

        try {
            const data = await repoService.getActivityBranches({
                owner,
                repo,
                cursor,
                token: req.user?.githubAccessToken,
            });
            const commonResponse: CommonResponse<GetRepoActivityBranchesData> = {
                success: true,
                status: 200,
                data,
            };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : CommonError.create500Error("GitHub 브랜치 목록을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };

    public activitySummary = async (req: AuthRequest, res: Response) => {
        const { owner, repo } = req.params;
        const { timezone, branch } = req.query;
        res.set("Cache-Control", "private, no-store");

        try {
            const data = await repoService.getActivitySummary({
                owner,
                repo,
                timezone,
                branch,
                token: req.user?.githubAccessToken,
            });
            const commonResponse: CommonResponse<GetRepoActivitySummaryData> = {
                success: true,
                status: 200,
                data,
            };
            res.json(commonResponse);
        } catch (error) {
            const errorResponse: CommonErrorResponse =
                error instanceof CommonError
                    ? error
                    : CommonError.create500Error("GitHub 저장소 활동을 조회하지 못했습니다.");
            res.status(errorResponse.status).json(errorResponse);
        }
    };
}

const repoController = new RepoControllers();
export default repoController;
