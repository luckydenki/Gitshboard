/** GET /api/search/users의 응답에 포함된 계정입니다. */
export interface UserSearchItem {
    login: string; // 계정 로그인명
    id: number; // 계정 ID
    avatar_url: string; // 아바타 URL
    url: string; // 계정 REST API URL
    html_url: string; // 웹 프로필 URL
    name?: string | null; // 공개 이름
    email?: string | null; // 공개 이메일
    type: "User" | "Organization"; // 계정 유형
    user_view_type?: string; // 계정 정보 공개 범위
}

/** GET /api/search/users의 응답 데이터입니다. */
export interface UserSearchData {
    total_count: number; // 전체 검색 결과 수
    items: UserSearchItem[]; // 요청 페이지의 계정 목록
}
