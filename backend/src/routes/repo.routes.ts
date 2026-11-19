import { Router } from "express";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import repoController from "../controllers/repo.controllers";
import repoProjectController from "../controllers/repo-project.controllers";
import repoCommitStatusController from "../controllers/repo-commit-status.controllers";

const repo_router = Router();

/**
 * @api GET /api/repos/:owner/:repo/commit-status/overview
 *
 * @desc 기본 브랜치의 완료된 최근 기간 커밋, 주별 코드 변화량과 시간대 분포를 조회합니다.
 *
 * @query timezone (IANA string, 선택) - 집계 시간대. 기본값 Asia/Seoul.
 *
 * @github backend/src/client/queries/github/repo-commit-status.query.ts
 *
 * @response backend/src/types/controllers/repo-commit-status.ts (GetRepoCommitStatusOverviewData)
 *
 * @error [400] : 저장소 주소 또는 시간대가 잘못된 경우.
 * @error [401] : GitHub 인증이 필요한 경우.
 * @error [403] : 저장소 접근 권한이 없거나 GitHub 조회 제한이 적용된 경우.
 * @error [404] : 조회할 수 있는 저장소가 없는 경우.
 * @error [429] : GitHub 조회 제한으로 재시도가 필요한 경우.
 * @error [500] : GitHub 커밋 조회 또는 집계에 실패한 경우.
 */
repo_router.get("/:owner/:repo/commit-status/overview", checkToken, checkUser, repoCommitStatusController.overview);

/**
 * @api GET /api/repos/:owner/:repo/commit-status/records
 *
 * @desc 기본 브랜치의 완료된 최근 1년 또는 명시적 전체 기간 커밋 전적을 조회합니다.
 *
 * @query timezone (IANA string, 선택) - 집계 시간대. 기본값 Asia/Seoul.
 * @query scope (rolling_year | all, 선택) - 전적 범위. 기본값 rolling_year.
 *
 * @github backend/src/client/queries/github/repo-commit-status.query.ts
 *
 * @response backend/src/types/controllers/repo-commit-status.ts (GetRepoCommitStatusRecordsData)
 *
 * @error [400] : 저장소 주소, 시간대 또는 범위가 잘못된 경우.
 * @error [401] : GitHub 인증이 필요한 경우.
 * @error [403] : 저장소 접근 권한이 없거나 GitHub 조회 제한이 적용된 경우.
 * @error [404] : 조회할 수 있는 저장소가 없는 경우.
 * @error [429] : GitHub 조회 제한으로 재시도가 필요한 경우.
 * @error [500] : GitHub 커밋 조회 또는 집계에 실패한 경우.
 */
repo_router.get("/:owner/:repo/commit-status/records", checkToken, checkUser, repoCommitStatusController.records);

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
 * @desc 선택한 브랜치의 커밋을 최신순 최대 100건까지 페이지 단위로 조회합니다.
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
 * @desc 저장소 전체의 PR·이슈 활동을 최신순 최대 100건까지 페이지 단위로 조회합니다.
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

/**
 * @api GET /api/repos/:owner/:repo/project/overview
 *
 * @desc 현재 언어, 저장소 용량, 이슈와 PR 합계를 조회합니다.
 *
 * @github backend/src/client/queries/github/repo-project-overview.query.ts
 *
 * @response backend/src/types/controllers/repo-project.ts (GetRepoProjectOverviewData)
 *
 * @error [400] : 저장소 주소가 올바르지 않은 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 또는 프로젝트 현황 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/project/overview", checkToken, checkUser, repoProjectController.overview);

/**
 * @api GET /api/repos/:owner/:repo/project/files
 *
 * @desc 기본 브랜치의 파일, 프레임워크, 커뮤니티 문서 현황을 조회합니다.
 *
 * @github backend/src/client/queries/github/repo-project-overview.query.ts
 * @github backend/src/types/github/rest/git-get-tree.ts
 * @github backend/src/types/github/rest/git-get-blob.ts
 *
 * @response backend/src/types/controllers/repo-project.ts (GetRepoProjectFilesData)
 *
 * @error [400] : 저장소 주소가 올바르지 않은 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 또는 프로젝트 현황 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/project/files", checkToken, checkUser, repoProjectController.files);

/**
 * @api GET /api/repos/:owner/:repo/project/branches
 *
 * @desc 브랜치와 최신 커밋 시각을 집계합니다.
 *
 * @github backend/src/client/queries/github/repo-project-branches.query.ts
 *
 * @response backend/src/types/controllers/repo-project.ts (GetRepoProjectBranchesData)
 *
 * @error [400] : 저장소 주소가 올바르지 않은 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 또는 프로젝트 현황 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/project/branches", checkToken, checkUser, repoProjectController.branches);

/**
 * @api GET /api/repos/:owner/:repo/project/history
 *
 * @desc 최근 월별 파일 수와 관측된 저장소 용량을 조회합니다.
 *
 * @github backend/src/types/github/rest/repos-get.ts
 * @github backend/src/types/github/rest/repos-list-commits.ts
 * @github backend/src/types/github/rest/git-get-tree.ts
 *
 * @response backend/src/types/controllers/repo-project.ts (GetRepoProjectHistoryData)
 *
 * @error [400] : 저장소 주소가 올바르지 않은 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 또는 프로젝트 현황 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/project/history", checkToken, checkUser, repoProjectController.history);

/**
 * @api GET /api/repos/:owner/:repo/project/participation
 *
 * @desc 월별 이슈·PR 작성자와 누적 커밋 작성자를 집계합니다.
 *
 * @github backend/src/types/github/rest/repos-get.ts
 * @github backend/src/types/github/rest/issues-list-for-repo.ts
 * @github backend/src/types/github/rest/repos-list-commits.ts
 *
 * @response backend/src/types/controllers/repo-project.ts (GetRepoProjectParticipationData)
 *
 * @error [400] : 저장소 주소가 올바르지 않은 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 또는 프로젝트 현황 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/project/participation", checkToken, checkUser, repoProjectController.participation);

/**
 * @api GET /api/repos/:owner/:repo/project/deployments
 *
 * @desc 최근 90일 production 배포 현황을 집계합니다.
 *
 * @github backend/src/client/queries/github/repo-project-deployments.query.ts
 * @github backend/src/client/queries/github/repo-project-deployment-statuses.query.ts
 *
 * @response backend/src/types/controllers/repo-project.ts (GetRepoProjectDeploymentsData)
 *
 * @error [400] : 저장소 주소가 올바르지 않은 경우.
 * @error [404] : 조회할 수 있는 저장소를 찾지 못한 경우.
 * @error [500] : GitHub 또는 프로젝트 현황 데이터를 조회하지 못한 경우.
 */
repo_router.get("/:owner/:repo/project/deployments", checkToken, checkUser, repoProjectController.deployments);

export default repo_router;
