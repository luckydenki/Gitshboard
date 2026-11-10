/** GET /api/search/users의 응답에 포함된 계정입니다. */
export interface UserSearchItem {
    id: string; // GitHub GraphQL 노드 ID
    login: string; // 계정 로그인명
    name: string | null; // 공개 이름
    avatar_url: string; // 아바타 URL
    html_url: string; // 웹 프로필 URL
    type: "User" | "Organization"; // 계정 유형
    bio: string | null; // 사용자 자기소개 또는 조직 소개
    location: string | null; // 공개 지역
    updated_at: string; // 계정 정보의 최근 업데이트 시각
}

/** GET /api/search/users의 응답 데이터입니다. */
export interface UserSearchData {
    total_count: number; // 전체 검색 결과 수
    items: UserSearchItem[]; // 요청 페이지의 계정 목록
    page_info: {
        has_next_page: boolean; // 다음 페이지가 있는지 여부
        end_cursor: string | null; // 다음 요청의 after에 전달할 커서
    };
}
