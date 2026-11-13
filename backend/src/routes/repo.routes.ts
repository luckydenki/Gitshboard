import { Router } from "express";
import { authToken, authUser, checkToken, checkUser } from "../middlewares/auth.middleware";
import repoController from "../controllers/repo.controllers";
import { GithubGraphqlFetch } from "../client/repo.client";
import { repositoryDashboardProfileQuery } from "../client/queries/github/repository-dashboard-profile.query";
import type { GetRepositoryDashboardProfileQuery, GetRepositoryDashboardProfileQueryVariables } from "../types/github/graphql/operations.generated";
import type { AuthRequest } from "../types/middlewares/auth";

const repo_router = Router();
/*
    graphql은 etag를 지원하지 않음
    만약 github api에서 일반 rest api를 사용해서 etag를 쓰고 싶다면 다음 내용을 헤더에 추가할 것
    1. 'Accept' : 'application/vnd.github+json',    //github api에서 json 형식으로 응답을 받기 위해 필요함.
    2. 'X-GitHub-Api-Version' : '2022-11-28'        //github api 버전.
*/
// api/repos/health
repo_router.get("/health", (req, res) => {
    res.json({ message: "Repo route is working!" });
});

//언어 사용량
//api/repos/languages
repo_router.get("/languages", authToken, authUser, repoController.languages);

// 커밋 시간
//api/repos/commitTime
repo_router.get("/commitTime", authToken, authUser, repoController.commitTime);

// 프로젝트 토픽
//api/repos/projectTopics
repo_router.get("/projectTopics", authToken, authUser, repoController.projectTopics);

// 실제 개발 관련 통계
//api/repos/developStats
repo_router.get("/developStats", authToken, authUser, repoController.developStats);

//api : api/repos/projectLiveRate
repo_router.get("/projectLiveRate", authToken, authUser, repoController.projectLiveRate);

/** 공개 저장소 또는 방문자에게 접근 권한이 있는 저장소의 프로필을 조회합니다. */
repo_router.get("/:owner/:repo/profile", checkToken, checkUser, async (req: AuthRequest, res) => {
    const { owner, repo } = req.params;
    res.set("Cache-Control", "private, no-store");

    if (typeof owner !== "string" || typeof repo !== "string" || !owner.trim() || !repo.trim()) {
        return res.status(400).json({ status: 400, title: "Bad Request", detail: "저장소 소유자와 이름이 필요합니다." });
    }

    try {
        const variables = { owner, name: repo } satisfies GetRepositoryDashboardProfileQueryVariables;
        const { repository } = await GithubGraphqlFetch<GetRepositoryDashboardProfileQuery>(
            req.user?.githubAccessToken,
            repositoryDashboardProfileQuery,
            variables,
        );
        if (!repository) {
            return res.status(404).json({ status: 404, title: "Not Found", detail: "저장소를 찾을 수 없습니다." });
        }
        return res.json({ success: true, status: 200, data: { repository } });
    } catch (error) {
        console.error("GitHub 저장소 프로필 조회 실패", error);
        return res.status(500).json({ status: 500, title: "GitHub API 요청 실패", detail: "저장소 프로필을 불러오지 못했습니다." });
    }
});

export default repo_router;
