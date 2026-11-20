/**
 * - AUTH_CHECK : 인증 체크입니다. 
 *      - endpoint : /api/auth/check

 * - SEARCH_RESULT : 검색 결과입니다. 
 *      - endpoint : /api/search/(users|repos)?{검색파라미터}
 *      - 비고 : 반드시 각 검색 결과를 구분하기 위해 검색 파라미터를 추가 key로 두세요.
 * - ORG_DASHBOARD_REPOSITORIES : 조직의 공개 저장소 목록입니다.
 *      - endpoint : /api/orgs/:login/repositories
 * - REPO_DASHBOARD_COMMIT_ACTIVITY : 선택한 브랜치의 최근 커밋 전적 목록입니다.
 *      - endpoint : /api/repos/:owner/:repo/activity/commits?branch={branch}&cursor={cursor}
 * - REPO_DASHBOARD_PR_ISSUE_ACTIVITY : 저장소 전체의 최근 PR·Issue 전적 목록입니다.
 *      - endpoint : /api/repos/:owner/:repo/activity/pull-requests-issues?cursor={cursor}
 * - REPO_DASHBOARD_ACTIVITY_BRANCHES : 최근 전적의 브랜치 선택 목록입니다.
 *      - endpoint : /api/repos/:owner/:repo/activity/branches?cursor={cursor}
 * - REPO_DASHBOARD_ACTIVITY_SUMMARY : 저장소 최근 활동의 사이드바 집계입니다.
 *      - endpoint : /api/repos/:owner/:repo/activity/summary?branch={branch}
 * - REPO_DASHBOARD_PROJECT_OVERVIEW : 프로젝트 현황의 언어, 용량, 이슈·PR 집계입니다.
 *      - endpoint : /api/repos/:owner/:repo/project/overview
 * - REPO_DASHBOARD_PROJECT_FILES : 프로젝트 현황의 파일, 프레임워크, 건강도입니다.
 *      - endpoint : /api/repos/:owner/:repo/project/files
 * - REPO_DASHBOARD_PROJECT_BRANCHES : 프로젝트 현황의 브랜치 집계입니다.
 *      - endpoint : /api/repos/:owner/:repo/project/branches
 * - REPO_DASHBOARD_PROJECT_HISTORY : 프로젝트 현황의 월별 파일·용량 이력입니다.
 *      - endpoint : /api/repos/:owner/:repo/project/history
 * - REPO_DASHBOARD_PROJECT_PARTICIPATION : 프로젝트 현황의 월별 참여자 이력입니다.
 *      - endpoint : /api/repos/:owner/:repo/project/participation
 * - REPO_DASHBOARD_PROJECT_DEPLOYMENTS : 프로젝트 현황의 배포 결과와 시간대 분포입니다.
 *      - endpoint : /api/repos/:owner/:repo/project/deployments
 * - REPO_DASHBOARD_COMMIT_STATUS_OVERVIEW : 기본 브랜치의 커밋 현황 개요입니다.
 *      - endpoint : /api/repos/:owner/:repo/commit-status/overview
 * - REPO_DASHBOARD_COMMIT_STATUS_RECORDS : 기본 브랜치의 최근 1년 커밋 전적입니다.
 *      - endpoint : /api/repos/:owner/:repo/commit-status/records
 * - REPO_DASHBOARD_READMES : 기본 브랜치의 README 목록입니다.
 *      - endpoint : /api/repos/:owner/:repo/readmes
 * - REPO_DASHBOARD_README_CONTENT : 선택한 README의 Markdown 원문입니다.
 *      - endpoint : /api/repos/:owner/:repo/readmes/content
 *
 *
 */
export enum QueryKeys {
    REPO_DASHBOARD_READMES = "repo-dashboard-readmes",
    REPO_DASHBOARD_README_CONTENT = "repo-dashboard-readme-content",
    AUTH_CHECK = "auth-check",
    SEARCH_RESULT = "search-results",
    ORG_DASHBOARD_REPOSITORIES = "org-dashboard-repositories",
    REPO_DASHBOARD_COMMIT_ACTIVITY = "repo-dashboard-commit-activity",
    REPO_DASHBOARD_PR_ISSUE_ACTIVITY = "repo-dashboard-pr-issue-activity",
    REPO_DASHBOARD_ACTIVITY_BRANCHES = "repo-dashboard-activity-branches",
    REPO_DASHBOARD_ACTIVITY_SUMMARY = "repo-dashboard-activity-summary",
    REPO_DASHBOARD_PROJECT_OVERVIEW = "repo-dashboard-project-overview",
    REPO_DASHBOARD_PROJECT_FILES = "repo-dashboard-project-files",
    REPO_DASHBOARD_PROJECT_BRANCHES = "repo-dashboard-project-branches",
    REPO_DASHBOARD_PROJECT_HISTORY = "repo-dashboard-project-history",
    REPO_DASHBOARD_PROJECT_PARTICIPATION = "repo-dashboard-project-participation",
    REPO_DASHBOARD_PROJECT_DEPLOYMENTS = "repo-dashboard-project-deployments",
    REPO_DASHBOARD_COMMIT_STATUS_OVERVIEW = "repo-dashboard-commit-status-overview",
    REPO_DASHBOARD_COMMIT_STATUS_RECORDS = "repo-dashboard-commit-status-records",
}
