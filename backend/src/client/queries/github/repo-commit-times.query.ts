export const repoCommitTimesQuery = /* GraphQL */ `
    query GetCommitTimes($login: String!) {
      user(login: $login) {
        repositories(first: 20) {
          nodes {
            name
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 50) {
                    nodes {
                      committedDate
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

`;
