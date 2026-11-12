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
