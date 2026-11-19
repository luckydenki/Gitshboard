/** 기본 브랜치의 커밋 이력과 줄 수를 조회합니다. link : https://docs.github.com/en/graphql/reference/commits */
export const repoCommitStatusQuery = /* GraphQL */ `
    query GetRepoCommitStatus($owner: String!, $name: String!, $since: GitTimestamp, $until: GitTimestamp, $after: String) {
        repository(owner: $owner, name: $name) {
            visibility
            defaultBranchRef {
                name
                target {
                    ... on Commit {
                        oid
                        history(first: 100, after: $after, since: $since, until: $until) {
                            totalCount
                            pageInfo { hasNextPage endCursor }
                            nodes { oid committedDate additions deletions }
                        }
                    }
                }
            }
        }
    }
`;
