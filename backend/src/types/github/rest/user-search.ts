/**
 * GitHub REST 사용자 검색 결과입니다.
 * type : REST
 * req : GET https://api.github.com/search/users
 * link : https://docs.github.com/en/rest/search/search#search-users
 */
export interface GitHubUserSearchResponse {
    total_count: number; // 검색 조건에 일치하는 전체 결과 수
    incomplete_results: boolean; // 검색 결과가 불완전한지 여부
    items: GitHubUserSearchItem[]; // 요청한 페이지의 계정 목록
}

/**
 * GitHub REST 사용자 검색 결과의 계정 항목입니다.
 * type : REST
 * req : GET https://api.github.com/search/users
 * link : https://docs.github.com/en/rest/search/search#search-users
 */
export interface GitHubUserSearchItem {
    login: string; // 계정 로그인명
    id: number; // 계정 ID
    node_id: string; // GraphQL 노드 ID
    avatar_url: string; // 아바타 URL
    gravatar_id: string | null; // Gravatar ID
    url: string; // 계정 REST API URL
    html_url: string; // 웹 프로필 URL
    followers_url: string; // 팔로워 API URL
    following_url: string; // 팔로잉 API URL 템플릿
    gists_url: string; // Gist API URL 템플릿
    starred_url: string; // 별표 저장소 API URL 템플릿
    subscriptions_url: string; // 구독 API URL
    organizations_url: string; // 조직 API URL
    repos_url: string; // 저장소 API URL
    events_url: string; // 계정 이벤트 API URL 템플릿
    received_events_url: string; // 수신 이벤트 API URL
    type: "User" | "Organization"; // 개인 또는 조직 계정 유형
    site_admin: boolean; // 사이트 관리자 여부
    score: number; // 검색 관련도 점수
    name?: string | null; // 공개 이름
    email?: string | null; // 공개 이메일
    starred_at?: string; // 별표를 추가한 시각
    user_view_type?: string; // 계정 정보의 공개 범위
    text_matches?: GitHubUserSearchTextMatch[]; // 검색어 일치 정보
}

/**
 * GitHub REST 사용자 검색에서 검색어가 일치한 위치입니다.
 * type : REST
 * req : GET https://api.github.com/search/users
 * link : https://docs.github.com/en/rest/search/search#text-match-metadata
 */
interface GitHubUserSearchTextMatch {
    object_url?: string; // 일치한 객체의 API URL
    object_type?: string | null; // 일치한 객체의 유형
    property?: string; // 검색어가 일치한 속성명
    fragment?: string; // 일치 부분을 포함하는 텍스트
    matches?: GitHubUserSearchMatch[]; // 텍스트 내 일치 목록
}

/**
 * GitHub REST 사용자 검색의 텍스트 조각 안에서 일치한 범위입니다.
 * type : REST
 * req : GET https://api.github.com/search/users
 * link : https://docs.github.com/en/rest/search/search#text-match-metadata
 */
interface GitHubUserSearchMatch {
    text?: string; // 검색어와 일치한 텍스트
    indices?: number[]; // 텍스트 조각 내 시작과 끝 인덱스
}
