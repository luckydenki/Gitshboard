/** 브랜치 이름과 최신 커밋 시각을 조회합니다. link : https://docs.github.com/en/graphql/reference/repos */
export const githubGetRepoProjectBranchesQuery = /* GraphQL */ `
    query GetRepoProjectBranches($owner: String!, $name: String!, $after: String) {
        repository(owner: $owner, name: $name) {
            visibility
            defaultBranchRef { name }
            refs(refPrefix: "refs/heads/", first: 100, after: $after, orderBy: {field: ALPHABETICAL, direction: ASC}) {
                totalCount
                pageInfo { endCursor hasNextPage }
                nodes { name target { ... on Commit { committedDate } } }
            }
        }
    }
`;
