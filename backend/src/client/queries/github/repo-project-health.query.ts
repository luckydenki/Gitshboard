export const repoProjectHealthQuery = /* GraphQL */ `
    query getProjectLiveRate($login: String!) {
      user(login: $login) {
        repositories(first: 20) {
          nodes {
            createdAt
            updatedAt
            pushedAt
            isArchived
            isFork
            name
          }
        }
      }
    }

`;
