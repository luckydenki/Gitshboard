/** 현재 언어, 용량, 이슈와 PR 합계를 조회합니다. link : https://docs.github.com/en/graphql/reference/repos */
export const githubGetRepoProjectOverviewQuery = /* GraphQL */ `
    query GetRepoProjectOverview($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
            id
            name
            owner { login }
            visibility
            defaultBranchRef { target { ... on Commit { tree { oid } } } }
            diskUsage
            languages(first: 100, orderBy: { field: SIZE, direction: DESC }) {
                totalSize
                edges { size node { name } }
            }
            openIssues: issues(states: [OPEN]) { totalCount }
            closedIssues: issues(states: [CLOSED]) { totalCount }
            openPullRequests: pullRequests(states: [OPEN]) { totalCount }
            mergedPullRequests: pullRequests(states: [MERGED]) { totalCount }
        }
    }
`;
