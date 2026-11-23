/** REST의 공용 목록 대신 순수 Issue와 통계 집계에 필요한 필드를 조회합니다. */
export const repoIssueStatsPageQuery = /* GraphQL */ `
    query GetRepoIssueStatsPage(
        $owner: String!
        $repo: String!
        $state: IssueState!
        $after: String
    ) {
        repository(owner: $owner, name: $repo) {
            issues(
                first: 100
                states: [$state]
                after: $after
                orderBy: { field: CREATED_AT, direction: DESC }
            ) {
                nodes {
                    state
                    stateReason
                    createdAt
                    closedAt
                    comments {
                        totalCount
                    }
                    assignees {
                        totalCount
                    }
                    labels(first: 100) {
                        nodes {
                            name
                        }
                        pageInfo {
                            hasNextPage
                        }
                    }
                    issueType {
                        name
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
