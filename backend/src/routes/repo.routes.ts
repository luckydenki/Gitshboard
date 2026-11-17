import { Router } from "express";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import repoController from "../controllers/repo.controllers";

const repo_router = Router();

/**
 * @api GET /api/repos/health
 *
 * @desc 저장소 라우트의 응답 여부를 확인합니다.
 *
 * @response backend/src/types/controllers/repo.ts (GetRepoHealthData)
 */
repo_router.get("/health", repoController.health);

/**
 * @api GET /api/repos/:owner/:repo/profile
 *
 * @desc 공개 저장소 또는 방문자에게 접근 권한이 있는 저장소의 프로필을 조회합니다.
 *
 * @github backend/src/client/queries/github/repository-dashboard-profile.query.ts
 *
 * @response backend/src/types/controllers/repo.ts (GetRepoProfileData)
 *
 * @error [400] : 저장소 소유자나 이름이 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 프로필 조회에 실패한 경우.
 */
repo_router.get("/:owner/:repo/profile", checkToken, checkUser, repoController.profile);

/**
 * @api GET /api/repos/:owner/:repo/activity/commits
 *
 * @desc 선택한 브랜치의 최근 7개 현지 날짜 커밋을 페이지 단위로 조회합니다.
 *
 * @query timezone (string, 선택) - IANA 시간대. 기본값 Asia/Seoul.
 * @query branch (string, 선택) - 생략하면 기본 브랜치를 조회합니다.
 * @query limit (integer, 선택) - 최근 전적 페이지 크기. 기본값 6, 최대 20.
 * @query cursor (string, 선택) - 같은 브랜치와 시간대에서 받은 다음 페이지 커서.
 *
 * @github backend/src/client/queries/github/repo-activity.query.ts
 * @github backend/src/types/github/rest/repos-get-commit.ts
 *
 * @response backend/src/types/controllers/repo.ts (GetRepoActivityData)
 *
 * @error [400] : 저장소 주소, 시간대, 페이지 크기 또는 커서가 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소 또는 브랜치를 찾지 못한 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 활동 데이터 조회에 실패한 경우.
 */
repo_router.get("/:owner/:repo/activity/commits", checkToken, checkUser, repoController.activityCommits);

/**
 * @api GET /api/repos/:owner/:repo/activity/pull-requests-issues
 *
 * @desc 저장소 전체에서 최근 7개 현지 날짜의 PR·이슈 활동을 페이지 단위로 조회합니다.
 *
 * @query timezone (string, 선택) - IANA 시간대. 기본값 Asia/Seoul.
 * @query limit (integer, 선택) - 최근 전적 페이지 크기. 기본값 6, 최대 20.
 * @query cursor (string, 선택) - 같은 저장소와 시간대에서 받은 다음 페이지 커서.
 *
 * @github backend/src/client/queries/github/repo-activity.query.ts
 *
 * @response backend/src/types/controllers/repo.ts (GetRepoActivityData)
 *
 * @error [400] : 저장소 주소, 시간대, 페이지 크기 또는 커서가 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 활동 데이터 조회에 실패한 경우.
 */
repo_router.get("/:owner/:repo/activity/pull-requests-issues", checkToken, checkUser, repoController.activityPullRequestsIssues);

/**
 * @api GET /api/repos/:owner/:repo/activity/branches
 *
 * @desc 기본 브랜치와 선택 가능한 브랜치 이름을 조회합니다.
 *
 * @query cursor (string, 선택) - 같은 저장소에서 반환된 다음 브랜치 페이지 커서.
 *
 * @github backend/src/client/queries/github/repo-activity-branches.query.ts
 *
 * @response backend/src/types/controllers/repo.ts (GetRepoActivityBranchesData)
 *
 * @error [400] : 저장소 주소 또는 브랜치 커서 형식이 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 브랜치 조회에 실패한 경우.
 */
repo_router.get("/:owner/:repo/activity/branches", checkToken, checkUser, repoController.activityBranches);

/**
 * @api GET /api/repos/:owner/:repo/activity/summary
 *
 * @desc 선택한 브랜치의 주간 커밋과 저장소 활동이 가장 활발한 날을 집계합니다.
 *
 * @query timezone (string, 선택) - IANA 시간대. 기본값 Asia/Seoul.
 * @query branch (string, 선택) - 생략하면 기본 브랜치를 조회합니다.
 *
 * @github backend/src/client/queries/github/repo-activity.query.ts
 *
 * @response backend/src/types/controllers/repo.ts (GetRepoActivitySummaryData)
 *
 * @error [400] : 저장소 주소 또는 시간대가 잘못된 경우.
 * @error [404] : 조회할 수 있는 저장소 또는 브랜치를 찾지 못한 경우.
 * @error [500] : 사용자 인증 처리 또는 GitHub 활동 데이터 조회에 실패한 경우.
 */
repo_router.get("/:owner/:repo/activity/summary", checkToken, checkUser, repoController.activitySummary);

export default repo_router;
