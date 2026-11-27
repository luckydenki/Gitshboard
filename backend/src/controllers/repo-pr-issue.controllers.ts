import type { Response } from "express";
import RepoPrIssueServices from "../services/repo-pr-issue.services";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";

class RepoPrIssueControllers {
    public getIssues = (req: AuthRequest, res: Response) => this.respond(req, res, "issues");
    public getPullRequests = (req: AuthRequest, res: Response) =>
        this.respond(req, res, "pullRequests");

    private async respond(req: AuthRequest, res: Response, endpoint: "issues" | "pullRequests") {
        const { owner, repo } = req.params;
        const { timezone = "Asia/Seoul" } = req.query;
        res.set("Cache-Control", "private, no-store");
        try {
            const location = RepoUtils.parseActivityLocation(owner, repo, timezone);
            if (
                Object.keys(req.query).some((key) => key !== "timezone") ||
                !location ||
                [".", ".."].includes(location.repo) ||
                location.owner.length > 39 ||
                location.repo.length > 100
            ) {
                throw CommonError.create400Error("저장소 주소 또는 집계 시간대가 잘못됐습니다.");
            }
            try {
                new Intl.DateTimeFormat("ko", { timeZone: location.timezone });
            } catch {
                throw CommonError.create400Error("유효한 IANA 시간대를 입력해 주세요.");
            }
            const accessToken = req.user?.githubAccessToken ?? process.env.PUBLIC_API_TOKEN;
            const service = new RepoPrIssueServices(
                location.owner,
                location.repo,
                location.timezone,
                accessToken,
                !!accessToken && !req.user?.githubAccessToken,
            );
            const data = await service[endpoint]();
            const commonResponse: CommonResponse<typeof data> = {
                status: 200,
                success: true,
                data,
            };
            return res.json(commonResponse);
        } catch (error) {
            const upstream =
                typeof error === "object" && error !== null && "status" in error
                    ? error.status
                    : undefined;
            const status =
                error instanceof CommonError
                    ? error.status
                    : upstream === 401 || upstream === 403 || upstream === 404 || upstream === 429
                      ? upstream
                      : 503;
            const errorResponse: CommonErrorResponse = {
                status,
                title: "PR·Issue 통계 조회 실패",
                type: "about:blank",
                detail:
                    error instanceof CommonError
                        ? error.detail
                        : "GitHub에서 저장소 통계를 가져오지 못했습니다.",
            };
            return res.status(status).json(errorResponse);
        }
    }
}

export default new RepoPrIssueControllers();
