/** 선택한 브랜치의 커밋과 저장소의 최근 PR·이슈 활동을 조회합니다. link : https://docs.github.com/en/graphql/reference/repos */
export const githubGetRepoActivityQuery = /* GraphQL */ `
    query GetRepoActivity(
        $owner: String!
        $name: String!
        $since: GitTimestamp
        $until: GitTimestamp!
        $includeSummary: Boolean!
        $readDefaultBranch: Boolean!
        $readSelectedBranch: Boolean!
        $qualifiedBranch: String!
        $readPullRequests: Boolean!
        $readIssues: Boolean!
        $commitAfter: String
        $pullRequestAfter: String
        $issueAfter: String
    ) {
        repository(owner: $owner, name: $name) {
            visibility
            name
            owner { login }
            defaultBranchRef @include(if: $readDefaultBranch) {
                ...RepoActivityBranch
            }
            selectedBranch: ref(qualifiedName: $qualifiedBranch) @include(if: $readSelectedBranch) {
                ...RepoActivityBranch
            }
            pullRequests(
                first: 25
                after: $pullRequestAfter
                orderBy: { field: UPDATED_AT, direction: DESC }
            ) @include(if: $readPullRequests) {
                pageInfo { endCursor hasNextPage }
                nodes {
                    id number title url createdAt updatedAt mergedAt baseRefName isDraft
                    author { login }
                    mergedBy { login }
                    reviews @skip(if: $includeSummary) { totalCount }
                    statusCheckRollup @skip(if: $includeSummary) { state }
                }
            }
            issues(
                first: 25
                after: $issueAfter
                orderBy: { field: UPDATED_AT, direction: DESC }
            ) @include(if: $readIssues) {
                pageInfo { endCursor hasNextPage }
                nodes {
                    id number title url createdAt updatedAt closedAt stateReason
                    author { login }
                    labels(first: 10) @skip(if: $includeSummary) { nodes { name } }
                    timelineItems(last: 1, itemTypes: [CLOSED_EVENT]) @skip(if: $includeSummary) {
                        nodes { ... on ClosedEvent { createdAt actor { login } } }
                    }
                }
            }
        }
    }
    fragment RepoActivityBranch on Ref {
        name
        target {
            ... on Commit {
                history(first: 100, after: $commitAfter, since: $since, until: $until) {
                    pageInfo { endCursor hasNextPage }
                    nodes {
                        oid
                        abbreviatedOid
                        committedDate
                        messageHeadline
                        url
                        changedFilesIfAvailable @skip(if: $includeSummary)
                        author { name user { login } }
                    }
                }
            }
        }
    }
`;
