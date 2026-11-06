import type {
    GitHubRepositorySearchItem,
    GitHubRepositorySearchResponse,
} from "../github/rest/repository-search";

/**
 * GET /api/search/repositories가 반환하는 저장소 항목입니다.
 */
type RepositorySearchItem = Pick<
    GitHubRepositorySearchItem,
    | "id" // 저장소 ID
    | "name" // 저장소 이름
    | "full_name" // 소유자를 포함한 저장소 이름
    | "description" // 저장소 설명
    | "html_url" // 저장소 웹 URL
    | "language" // 주 사용 언어
    | "stargazers_count" // 별표 수
    | "forks_count" // 포크 수
    | "created_at" // 생성 시각
    | "updated_at" // 업데이트 시각
    | "license" // 라이선스 정보
> & {
    owner: Pick<
        GitHubRepositorySearchItem["owner"],
        | "login" // 소유 계정 로그인명
        | "avatar_url" // 소유 계정 아바타 URL
        | "html_url" // 소유 계정 프로필 URL
        | "type" // 소유 계정 유형
    >;
};

/**
 * GET /api/search/repositories의 응답 데이터입니다.
 * total_count는 전체 검색 결과 수, incomplete_results는 검색 결과의 불완전 여부입니다.
 */
export type RepositorySearchData = Pick<
    GitHubRepositorySearchResponse,
    "total_count" | "incomplete_results"
> & {
    items: RepositorySearchItem[]; // 요청 페이지의 저장소 목록
};
