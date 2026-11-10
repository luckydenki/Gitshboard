export const repoDeveloperProfileQuery = /* GraphQL */ `
    query GetDevelopTime($login: String!) {
      user(login: $login) {
        repositories(first: 20) {
          nodes {
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 30) {
                    nodes {
                      committedDate
                    }
                  }
                }
              }
            }
            languages(first: 20) {
              edges {
                node {
                  name
                }
              }
            }
            repositoryTopics(first: 20) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
    }

`;
