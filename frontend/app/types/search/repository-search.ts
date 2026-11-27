/** GET /api/search/repositories의 응답에 포함된 라이선스 정보입니다. */
interface RepositorySearchLicense {
    key: string; // GitHub 라이선스 키
    name: string; // 라이선스 이름
    spdx_id: string | null; // SPDX 식별자
    url: string | null; // 라이선스 API URL
    node_id: string; // 라이선스 노드 ID
    html_url?: string; // 라이선스 웹 URL
}

/** GET /api/search/repositories의 응답에 포함된 저장소입니다. */
export interface RepositorySearchItem {
    id: number; // 저장소 ID
    name: string; // 저장소 이름
    full_name: string; // 소유자를 포함한 저장소 이름
    description: string | null; // 저장소 설명
    html_url: string; // 저장소 웹 URL
    owner: {
        login: string; // 소유 계정 로그인명
        avatar_url: string; // 소유 계정 아바타 URL
        html_url: string; // 소유 계정 웹 프로필 URL
        type: "User" | "Organization"; // 소유 계정 유형
    };
    language: string | null; // 주 사용 언어
    stargazers_count: number; // 별표 수
    forks_count: number; // 포크 수
    created_at: string; // 생성 시각
    updated_at: string; // 업데이트 시각
    license: RepositorySearchLicense | null; // 라이선스 정보
}

/** GET /api/search/repositories의 응답 데이터입니다. */
export interface RepositorySearchData {
    total_count: number; // 전체 검색 결과 수
    incomplete_results: boolean; // 검색 결과의 불완전 여부
    items: RepositorySearchItem[]; // 요청 페이지의 저장소 목록
}
