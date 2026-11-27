/** 지정한 저장소의 기본 브랜치에서 특정 작성자가 지정 시점 이후 남긴 커밋을 조회합니다. */
export const userRecentCommitsQuery = /* GraphQL */ `
    query GetUserRecentCommits($repositoryIds: [ID!]!, $authorId: ID!, $limit: Int!, $since: GitTimestamp!) {
        nodes(ids: $repositoryIds) {
            __typename
            ... on Repository {
                nameWithOwner
                visibility
                defaultBranchRef {
                    target {
                        __typename
                        ... on Commit {
                            history(first: $limit, author: { id: $authorId }, since: $since) {
                                nodes {
                                    oid
                                    abbreviatedOid
                                    messageHeadline
                                    committedDate
                                    committedViaWeb
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
