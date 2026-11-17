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
 *
 *
 */
export enum QueryKeys {
    AUTH_CHECK = "auth-check",
    SEARCH_RESULT = "search-results",
    ORG_DASHBOARD_REPOSITORIES = "org-dashboard-repositories",
    REPO_DASHBOARD_COMMIT_ACTIVITY = "repo-dashboard-commit-activity",
    REPO_DASHBOARD_PR_ISSUE_ACTIVITY = "repo-dashboard-pr-issue-activity",
    REPO_DASHBOARD_ACTIVITY_BRANCHES = "repo-dashboard-activity-branches",
    REPO_DASHBOARD_ACTIVITY_SUMMARY = "repo-dashboard-activity-summary",
}
