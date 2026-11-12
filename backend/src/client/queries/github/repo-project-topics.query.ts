/** 사용자 저장소의 이름과 등록된 토픽을 조회합니다. */
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
