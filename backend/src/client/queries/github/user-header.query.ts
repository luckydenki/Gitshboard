export const userHeaderQuery = /* GraphQL */ `
    query GetUser($login: String!) {
      user(login: $login) {
        login
        avatarUrl
      }
    }

`;
