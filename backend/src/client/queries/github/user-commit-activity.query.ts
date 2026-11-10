export const userCommitActivityQuery = /* GraphQL */ `
    query GetCommitActivity($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              name
              nameWithOwner
            }
            contributions(first: 100, orderBy: {field: OCCURRED_AT, direction: ASC}) {
              nodes {
                occurredAt
                commitCount
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }
    }

`;
