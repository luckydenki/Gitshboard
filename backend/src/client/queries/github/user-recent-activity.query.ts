/** 사용자의 최근 이슈와 PR, 지정 시점 이후 커밋에 기여한 저장소 ID를 조회합니다. */
export const userRecentActivityQuery = /* GraphQL */ `
    query GetUserRecentActivity($login: String!, $limit: Int!, $since: DateTime!) {
        user(login: $login) {
            id
            issues(first: $limit, orderBy: { field: CREATED_AT, direction: DESC }) {
                nodes {
                    id
                    number
                    title
                    state
                    createdAt
                    url
                    author { login }
                    comments { totalCount }
                    repository { nameWithOwner visibility }
                }
            }
            pullRequests(first: $limit, orderBy: { field: CREATED_AT, direction: DESC }) {
                nodes {
                    id
                    number
                    title
                    state
                    createdAt
                    url
                    author { login }
                    comments { totalCount }
                    repository { nameWithOwner visibility }
                }
            }
            contributionsCollection(from: $since) {
                commitContributionsByRepository(maxRepositories: 100) {
                    repository { id visibility }
                }
            }
        }
    }
`;
