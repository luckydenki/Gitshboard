/**
 * - AUTH_CHECK : 인증 체크입니다. 
 *      - endpoint : /api/auth/check

 * - SEARCH_RESULT : 검색 결과입니다. 
 *      - endpoint : /api/search/(users|repos)?{검색파라미터}
 *      - 비고 : 반드시 각 검색 결과를 구분하기 위해 검색 파라미터를 추가 key로 두세요.
 * - ORG_DASHBOARD_REPOSITORIES : 조직의 공개 저장소 목록입니다.
 *      - endpoint : /api/orgs/:login/repositories
 *
 *
 */
export enum QueryKeys {
    AUTH_CHECK = "auth-check",
    SEARCH_RESULT = "search-results",
    ORG_DASHBOARD_REPOSITORIES = "org-dashboard-repositories",
}
