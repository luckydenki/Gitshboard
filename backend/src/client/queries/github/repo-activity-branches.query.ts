/** 저장소의 기본 브랜치와 브랜치 목록을 조회합니다. link : https://docs.github.com/en/graphql/reference/repos */
export const githubGetRepoActivityBranchesQuery = /* GraphQL */ `
    query GetRepoActivityBranches($owner: String!, $name: String!, $after: String) {
        repository(owner: $owner, name: $name) {
            visibility
            defaultBranchRef { name }
            refs(refPrefix: "refs/heads/", first: 100, after: $after, orderBy: { field: ALPHABETICAL, direction: ASC }) {
                nodes { name }
                pageInfo { hasNextPage endCursor }
            }
        }
    }
`;
