/** 사용자가 소유한 공개 저장소 목록을 최근 갱신순으로 페이지 단위로 조회합니다. */
export const userPublicRepositoriesQuery = /* GraphQL */ `
    query GetUserPublicRepositories($login: String!, $after: String) {
        user(login: $login) {
            repositories(
                first: 100
                after: $after
                ownerAffiliations: [OWNER]
                privacy: PUBLIC
                orderBy: { field: UPDATED_AT, direction: DESC }
            ) {
                totalCount
                pageInfo { hasNextPage endCursor }
                nodes {
                    name
                    nameWithOwner
                    url
                    stargazerCount
                    forkCount
                    updatedAt
                    primaryLanguage { name color }
                }
            }
        }
    }
`;
