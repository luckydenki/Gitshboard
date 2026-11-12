/** 사용자 저장소의 기본 브랜치에서 최근 커밋 시각을 조회합니다. */
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
