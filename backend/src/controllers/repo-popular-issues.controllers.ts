import type { Response } from "express";
import type { AuthRequest } from "../types/middlewares/auth";
import type { CommonResponse } from "../types/middlewares/common";
import type { GetRepoPopularIssuesData } from "../types/controllers/repo-popular-issues";
import { getPopularIssues } from "../services/repo-popular-issues.services";

/** 인기 Issue의 수집·점수 집계 요청을 처리합니다. */
export async function getRepoPopularIssues(req: AuthRequest, res: Response) {
    const { owner, repo } = req.params;
    if (
        typeof owner !== "string" ||
        typeof repo !== "string" ||
        !/^[a-zA-Z0-9_.-]{1,100}$/.test(owner) ||
        !/^[a-zA-Z0-9_.-]{1,100}$/.test(repo) ||
        [".", ".."].includes(repo) ||
        owner.length > 39 ||
        Object.keys(req.query).length
    ) {
        return res.status(400).json({
            status: 400,
            title: "잘못된 요청",
            type: "about:blank",
            detail: "저장소 경로 또는 쿼리 파라미터가 올바르지 않습니다.",
        });
    }
    try {
        const data = await getPopularIssues(owner, repo, req.user?.githubAccessToken);
        const commonResponse: CommonResponse<GetRepoPopularIssuesData> = {
            success: true,
            status: 200,
            data,
        };
        res.set("Cache-Control", "private, no-store");
        return res.json(commonResponse);
    } catch (error) {
        const upstream =
            typeof error === "object" && error !== null && "status" in error
                ? Number(error.status)
                : 500;
        const status = [401, 403, 404, 429].includes(upstream) ? upstream : 503;
        return res.status(status).json({
            status,
            type: "about:blank",
            title: "GitHub 조회 실패",
            detail: "인기 Issue를 불러오지 못했습니다.",
        });
    }
}
