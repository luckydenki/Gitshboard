/** 조직이 소유한 공개 저장소 목록. link : https://docs.github.com/en/graphql/reference/objects#organization */
export const githubOrgPublicRepositoriesQuery = /* GraphQL */ `
    query OrgPublicRepositories($login: String!, $after: String) {
        organization(login: $login) {
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
