/** 동일 저장소에서 PR이 참조하는 Issue의 커서를 조회합니다. */
export const repoPullClosingIssuesQuery = /* GraphQL */ `
    query GetRepoPullClosingIssues($owner: String!, $repo: String!, $number: Int!, $after: String) {
        repository(owner: $owner, name: $repo) {
            pullRequest(number: $number) {
                closingIssuesReferences(first: 100, after: $after) {
                    nodes {
                        id
                        repository {
                            nameWithOwner
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
    }
`;
