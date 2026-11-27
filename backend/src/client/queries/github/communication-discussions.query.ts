/** Discussion 분포·답변·인기 후보 조회. */
export const communicationDiscussionsQuery = /* GraphQL */ `
    query GetCommunicationDiscussions($owner: String!, $name: String!, $after: String) {
        repository(owner: $owner, name: $name) {
            hasDiscussionsEnabled
            discussionCategories(first: 100) {
                nodes {
                    id
                    name
                    isAnswerable
                }
            }
            discussions(
                first: 100
                after: $after
                orderBy: { field: CREATED_AT, direction: DESC }
            ) {
                nodes {
                    id
                    number
                    title
                    url
                    createdAt
                    author {
                        ... on Node {
                            id
                        }
                    }
                    upvoteCount
                    category {
                        id
                        name
                        isAnswerable
                    }
                    answer {
                        id
                    }
                    comments {
                        totalCount
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;
