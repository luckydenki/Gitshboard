/** Fetches a continuation page of statuses for one GitHub deployment. */
export const githubGetRepoProjectDeploymentStatusesQuery = /* GraphQL */ `
    query GetRepoProjectDeploymentStatuses($id: ID!, $after: String!) {
        node(id: $id) {
            ... on Deployment {
                statuses(first: 100, after: $after) {
                    pageInfo { hasNextPage endCursor }
                    nodes { id state createdAt }
                }
            }
        }
    }
`;
