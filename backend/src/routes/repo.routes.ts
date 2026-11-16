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


/**
 * @api GET /api/repos/:owner/:repo/activity
 *
 * @desc 최근 7개 현지 날짜의 커밋 및 PR·이슈 활동 목록을 페이지 단위로 조회합니다.
 *
 * @query timezone (string, 선택) - IANA 시간대. 기본값 Asia/Seoul.
 * @query limit (integer, 선택) - 최근 전적 페이지 크기. 기본값 6, 최대 20.
 * @query cursor (string, 선택) - 같은 저장소와 시간대에서 받은 다음 페이지 커서.
 *
 * @github backend/src/client/queries/github/repo-activity.query.ts
 * @github backend/src/types/github/rest/repos-get-commit.ts
 *
 * @response backend/src/types/response/repo-activity.ts
 *
 * @error [400] : 저장소 주소, 시간대, 페이지 크기 또는 커서가 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 활동 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/activity", checkToken, checkUser, repoController.activity);

/**
 * @api GET /api/repos/:owner/:repo/activity/summary
 *
 * @desc 최근 7개 현지 날짜의 주간 커밋, 활동 리듬 및 이슈 첫 응답을 집계합니다.
 *
 * @query timezone (string, 선택) - IANA 시간대. 기본값 Asia/Seoul.
 *
 * @github backend/src/client/queries/github/repo-activity.query.ts
 *
 * @response backend/src/types/response/repo-activity-summary.ts
 *
 * @error [400] : 저장소 주소 또는 시간대가 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 활동 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/activity/summary", checkToken, checkUser, repoController.activitySummary);

export default repo_router;
