/** GitHub REST API `GET /search/users`의 검색 결과 항목입니다. */
interface GitHubSearchUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: "User" | "Organization";
    score: number;

    // `tag` 필드는 GitHub API에서 제공하지 않습니다.
    // derived: `type`이 "User"이면 "사용자", "Organization"이면 "조직"처럼 화면용 문구로 변환합니다.
}

/** GitHub REST API `GET /search/users`의 응답 본문입니다. */
interface GitHubSearchUsersResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubSearchUser[];
}

/** GitHub REST API `GET /users/{username}`의 사용자 프로필에서 카드에 사용하는 필드입니다. */
interface GitHubUserProfile {
    login: string;
    name: string | null;
    bio: string | null;
    location: string | null;
}

/**
 * // derived: 검색 응답의 각 `login`으로 `GET /users/{username}`을 요청한 뒤
 * `GitHubSearchUser`와 `GitHubUserProfile`을 `login` 기준으로 결합해 만듭니다.
 */
export type GitHubSearchUserCard = GitHubSearchUser & GitHubUserProfile & {
    /** derived: 소유 저장소가 받은 star 수의 합계입니다. */
    total_stars: number;
    /** 사용자 프로필의 최근 업데이트 시각입니다. */
    updated_at: string;
};

/** // derived: 기본 검색 응답의 `items`에 사용자 상세 조회 필드를 결합한 화면용 응답입니다. */
export type GitHubSearchUserCardResponse = Omit<GitHubSearchUsersResponse, "items"> & {
    items: GitHubSearchUserCard[];
};

/** 검색 결과 화면용 저장소 모델입니다. */
export interface SearchRepoCard {
    id: number;
    type: "Repository";
    name: string;
    full_name: string;
    owner: { login: string; avatar_url: string };
    html_url: string;
    description: string | null;
    stargazers_count: number;
    updated_at: string;
    language: string | null;
    forks_count: number;
}

export type SearchResultItem = GitHubSearchUserCard | SearchRepoCard;

/** 유저와 저장소 결과를 함께 담는 화면용 응답입니다. */
export interface SearchResultResponse {
    total_count: number;
    incomplete_results: boolean;
    items: SearchResultItem[];
}
