export const userRecentActivityQuery = /* GraphQL */ `
    query GetUserRecentActivity($login: String!, $limit: Int!, $since: DateTime!) {
        user(login: $login) {
            id
            issues(first: $limit, orderBy: { field: CREATED_AT, direction: DESC }) {
                nodes {
                    id
                    number
                    title
                    state
                    createdAt
                    url
                    author { login }
                    comments { totalCount }
                    repository { nameWithOwner visibility }
                }
            }
            pullRequests(first: $limit, orderBy: { field: CREATED_AT, direction: DESC }) {
                nodes {
                    id
                    number
                    title
                    state
                    createdAt
                    url
                    author { login }
                    comments { totalCount }
                    repository { nameWithOwner visibility }
                }
            }
            contributionsCollection(from: $since) {
                commitContributionsByRepository(maxRepositories: 100) {
                    repository { id visibility }
                }
            }
        }
    }
`;
