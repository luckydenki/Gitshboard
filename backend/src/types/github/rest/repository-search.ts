import type { GitHubUserSearchItem } from "./user-search";

/**
 * GitHub REST 저장소 검색 결과입니다.
 * type : REST
 * req : GET https://api.github.com/search/repositories
 * link : https://docs.github.com/en/rest/search/search#search-repositories
 */
export interface GitHubRepositorySearchResponse {
    total_count: number; // 전체 검색 결과 수
    incomplete_results: boolean; // 검색 결과가 불완전한지 여부
    items: GitHubRepositorySearchItem[]; // 요청 페이지의 저장소 목록
}

/**
 * GitHub REST 저장소 검색 결과의 라이선스 정보입니다.
 * type : REST
 * req : GET https://api.github.com/search/repositories
 * link : https://docs.github.com/en/rest/search/search#search-repositories
 */
interface GitHubRepositoryLicense {
    key: string; // GitHub 라이선스 키
    name: string; // 라이선스 이름
    spdx_id: string | null; // SPDX 식별자
    url: string | null; // 라이선스 API URL
    node_id: string; // 라이선스 노드 ID
    html_url?: string; // 라이선스 웹 URL
}

/**
 * GitHub REST 저장소 검색의 저장소 항목입니다.
 * type : REST
 * req : GET https://api.github.com/search/repositories
 * link : https://docs.github.com/en/rest/search/search#search-repositories
 */
export interface GitHubRepositorySearchItem {
    id: number; // 저장소 ID
    node_id: string; // GraphQL 노드 ID
    name: string; // 저장소 이름
    full_name: string; // 소유자를 포함한 저장소 이름
    description: string | null; // 저장소 설명
    html_url: string; // 저장소 웹 URL
    owner: Omit<GitHubUserSearchItem, "score" | "text_matches" | "starred_at">; // 소유 계정
    language: string | null; // 주 사용 언어
    stargazers_count: number; // 별표 수
    forks_count: number; // 포크 수
    watchers_count: number; // GitHub가 제공하는 watchers_count
    open_issues_count: number; // 열린 이슈와 풀 요청 수
    created_at: string; // 생성 시각
    updated_at: string; // 업데이트 시각
    pushed_at: string; // 마지막 푸시 시각
    license: GitHubRepositoryLicense | null; // 라이선스 정보
    private: boolean; // 비공개 여부
    visibility?: "public" | "private" | "internal"; // 공개 범위
    fork: boolean; // 포크 저장소 여부
    archived: boolean; // 보관 여부
    disabled: boolean; // 비활성화 여부
    default_branch: string; // 기본 브랜치
    master_branch?: string; // 기존 기본 브랜치 정보
    homepage: string | null; // 프로젝트 홈페이지
    size: number; // 저장소 크기
    score: number; // 검색 관련도 점수
    forks: number; // 포크 수의 별칭
    watchers: number; // watchers_count의 별칭
    open_issues: number; // 열린 이슈 수의 별칭
    topics?: string[]; // 주제 목록
    has_issues: boolean; // 이슈 기능 활성 여부
    has_projects: boolean; // 프로젝트 기능 활성 여부
    has_pages: boolean; // GitHub Pages 사용 여부
    has_wiki: boolean; // 위키 기능 활성 여부
    has_downloads: boolean; // 다운로드 기능 활성 여부
    has_discussions?: boolean; // 토론 기능 활성 여부
    is_template?: boolean; // 템플릿 저장소 여부
    allow_forking?: boolean; // 포크 허용 여부
    web_commit_signoff_required?: boolean; // 웹 커밋 서명 확인 요구 여부
    permissions?: {
        admin: boolean; // 관리 권한
        maintain?: boolean; // 유지 관리 권한
        push: boolean; // 쓰기 권한
        triage?: boolean; // 분류 권한
        pull: boolean; // 읽기 권한
    }; // 요청자의 저장소 권한
    text_matches?: GitHubUserSearchItem["text_matches"]; // 검색어 일치 정보
    url: string; // 저장소 REST API URL
    mirror_url: string | null; // 미러 URL
    [relatedUrl: `${string}_url`]: string | null | undefined; // 클론 및 관련 리소스 URL과 URL 템플릿
}
