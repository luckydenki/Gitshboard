/**
 * 대시보드 프로필 카드에 필요한 GitHub GraphQL `viewer` 응답 타입입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/objects#user
 *
 * graphQL :
 * query ViewerProfile {
 *   viewer {
 *     avatarUrl(size: 160)
 *     login
 *     url
 *     name
 *     bio
 *     location
 *     company
 *     websiteUrl
 *     createdAt
 *     socialAccounts(first: 10) {
 *       nodes { url }
 *     }
 *     followers { totalCount }
 *     following { totalCount }
 *     contributionsCollection {
 *       contributionCalendar { totalContributions }
 *     }
 *   }
 * }
 */
export interface Profile {
    avatarUrl: string; // 160px 크기의 프로필 이미지 URL
    login: string; // GitHub 사용자 로그인 ID
    url: string; // GitHub 프로필 페이지 URL
    name: string | null; // 프로필에 표시하는 이름
    bio: string | null; // 프로필 소개
    location: string | null; // 프로필에 등록한 위치
    company: string | null; // 소속 회사 또는 조직
    websiteUrl: string | null; // 프로필 개인 웹사이트 URL
    createdAt: string; // 계정 생성 시각(ISO 8601)
    socialAccounts: {
        nodes: Array<{
            url: string; // 소셜 계정 URL
        } | null>;
    }; // 연결한 소셜 계정 목록
    socialAccountsList? : Array<string> // derived : nodes:Array<{url}>의 url리스트
    followers: {
        totalCount: number; // 팔로워 수
    };
    following: {
        totalCount: number; // 팔로잉 수
    };
    followersTotal? : number; // derived : followers 의 totalCount 값,
    followingTotal? : number //derived : following 의 totalCount값
    contributionsCollection: {
        contributionCalendar: {
            totalContributions: number; // 전체 기여 수
        };
    };
    contributionsCollectionTotal? : number // derived : contributionCollection : contributionCalendar의 totalContributions 값
}




