/** 사용자 헤더에 표시할 GitHub 로그인과 아바타 URL을 조회합니다. */
export const userHeaderQuery = /* GraphQL */ `
    query GetUser($login: String!) {
      user(login: $login) {
        login
        avatarUrl
      }
    }

`;
