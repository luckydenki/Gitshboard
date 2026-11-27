import type { Response } from "express";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import RepoCommunicationServices from "../services/repo-communication.services";
import CommonError from "../utils/common-error";
class RepoCommunicationControllers {
    public get = async (req: AuthRequest, res: Response) => {
        const { owner, repo, endpoint } = req.params;
        res.set("Cache-Control", "private, no-store");
        try {
            if (
                typeof owner !== "string" ||
                typeof repo !== "string" ||
                typeof endpoint !== "string" ||
                !/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(owner) ||
                owner.includes("--") ||
                !/^[a-z0-9_.-]{1,100}$/i.test(repo) ||
                [".", ".."].includes(repo) ||
                Object.keys(req.query).length
            )
                throw CommonError.create400Error("저장소 주소 또는 쿼리가 잘못됐습니다.");
            if (!["contributors", "onboarding", "discussions", "releases"].includes(endpoint))
                throw CommonError.create404Error("조회 항목을 찾을 수 없습니다.");
            const token = req.user?.githubAccessToken ?? process.env.PUBLIC_API_TOKEN;
            const data = await new RepoCommunicationServices(
                owner,
                repo,
                token,
                !!token && !req.user?.githubAccessToken,
            ).get(endpoint);
            const commonResponse: CommonResponse<typeof data> = {
                status: 200,
                success: true,
                data,
            };
            return res.json(commonResponse);
        } catch (error) {
            const raw = error as {
                status?: number;
                response?: { headers?: Record<string, string> };
                message?: string;
            };
            const limited =
                raw.status === 429 ||
                (raw.status === 403 &&
                    (raw.response?.headers?.["x-ratelimit-remaining"] === "0" ||
                        raw.response?.headers?.["retry-after"] ||
                        /rate limit/i.test(raw.message ?? "")));
            const status =
                error instanceof CommonError
                    ? error.status
                    : limited
                      ? 429
                      : raw.status === 401 || raw.status === 403 || raw.status === 404
                        ? raw.status
                        : 503;
            const response: CommonErrorResponse = {
                status,
                title: "커뮤니케이션 조회 실패",
                type: "about:blank",
                detail:
                    error instanceof CommonError
                        ? error.detail
                        : "GitHub 커뮤니케이션 데이터를 가져오지 못했습니다.",
            };
            return res.status(status).json(response);
        }
    };
}
export default new RepoCommunicationControllers();
