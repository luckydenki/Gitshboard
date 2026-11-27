/** Fetches a page of production deployments and their status timelines. */
export const githubGetRepoProjectDeploymentsQuery = /* GraphQL */ `
    query GetRepoProjectDeployments($owner: String!, $name: String!, $after: String) {
        repository(owner: $owner, name: $name) {
            visibility
            deployments(
                first: 25
                after: $after
                environments: ["production"]
                orderBy: {field: CREATED_AT, direction: DESC}
            ) {
                pageInfo { hasNextPage endCursor }
                nodes {
                    id
                    createdAt
                    statuses(first: 20) {
                        pageInfo { hasNextPage endCursor }
                        nodes { id state createdAt }
                    }
                }
            }
        }
    }
`;
