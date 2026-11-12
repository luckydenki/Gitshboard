/** 프로젝트 활동 상태를 파악하기 위해 저장소의 생성·갱신·푸시 시각과 보관·포크 여부를 조회합니다. */
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
