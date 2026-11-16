/** Lists the recent commit, pull request and issue activity of a repository. */
export const githubRepoActivityQuery = /* GraphQL */ `
    query RepoActivity(
        $owner: String!
        $name: String!
        $since: GitTimestamp!
        $until: GitTimestamp!
        $includeSummary: Boolean!
        $readCommits: Boolean!
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
            defaultBranchRef @include(if: $readCommits) {
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
                    comments(first: 10) @include(if: $includeSummary) {
                        pageInfo { hasNextPage }
                        nodes { createdAt author { login __typename } }
                    }
                    timelineItems(last: 1, itemTypes: [CLOSED_EVENT]) @skip(if: $includeSummary) {
                        nodes { ... on ClosedEvent { createdAt actor { login } } }
                    }
                }
            }
        }
    }
`;
