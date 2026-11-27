/** 열린 Issue의 관심 신호와 최근 반응을 한 페이지에서 조회합니다. */
export const repoPopularIssuePageQuery = /* GraphQL */ `
    query GetRepoPopularIssuePage($owner: String!, $repo: String!, $after: String) {
        repository(owner: $owner, name: $repo) {
            issues(
                first: 100
                states: [OPEN]
                after: $after
                orderBy: { field: CREATED_AT, direction: DESC }
            ) {
                nodes {
                    number
                    title
                    url
                    updatedAt
                    comments {
                        totalCount
                    }
                    reactionGroups {
                        content
                        reactors(first: 1) {
                            totalCount
                        }
                    }
                    reactions(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
                        totalCount
                        nodes {
                            createdAt
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`;
