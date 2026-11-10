export const repoProjectTopicsQuery = /* GraphQL */ `
    query GetProjectTopics($login: String!) {
      user(login: $login) {
        repositories(first: 20) {
          nodes {
            name
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
