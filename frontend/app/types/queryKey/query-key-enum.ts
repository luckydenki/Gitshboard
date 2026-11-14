/**
 * - AUTH_CHECK : 인증 체크입니다. 
 *      - endpoint : /api/auth/check

 * - SEARCH_RESULT : 검색 결과입니다. 
 *      - endpoint : /api/search/(users|repos)?{검색파라미터}
 *      - 비고 : 반드시 각 검색 결과를 구분하기 위해 검색 파라미터를 추가 key로 두세요.
 *
 *
 */
export enum QueryKeys {
    AUTH_CHECK = "auth-check",
    SEARCH_RESULT = "search-results",
}
