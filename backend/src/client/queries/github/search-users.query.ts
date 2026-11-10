/**
 * GitHub 검색 결과 카드에 사용할 계정 정보와 다음 페이지 커서를 조회합니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/queries#search
 */
export const searchUsersQuery = /* GraphQL */ `
    query SearchUsers($query: String!, $first: Int!, $after: String) {
        search(query: $query, type: USER, first: $first, after: $after) {
            userCount
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes {
                __typename
                ... on User {
                    id
                    login
                    name
                    avatarUrl
                    url
                    bio
                    location
                    updatedAt
                }
                ... on Organization {
                    id
                    login
                    name
                    avatarUrl
                    url
                    bio: description
                    location
                    updatedAt
                }
            }
        }
    }
`;
