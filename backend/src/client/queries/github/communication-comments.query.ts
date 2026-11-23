/** Discussion 댓글 및 대댓글 페이지 조회. */
export const communicationCommentsQuery = /* GraphQL */ `
    query GetCommunicationComments($id: ID!, $after: String) {
        node(id: $id) {
            ... on Discussion {
                comments(first: 100, after: $after) {
                    nodes {
                        id
                        replies {
                            totalCount
                        }
                        createdAt
                        author {
                            ... on Node {
                                id
                            }
                            __typename
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
            ... on DiscussionComment {
                replies(first: 100, after: $after) {
                    nodes {
                        id
                        createdAt
                        author {
                            ... on Node {
                                id
                            }
                            __typename
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }
    }
`;
