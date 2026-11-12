/** 개발자 프로필에 사용할 저장소별 최근 커밋 시각, 언어, 토픽을 조회합니다. */
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
