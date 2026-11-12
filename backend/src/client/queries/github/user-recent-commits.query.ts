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
