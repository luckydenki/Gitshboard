/** 사용자가 소유한 저장소의 언어별 코드 크기를 조회합니다. */
export const repoLanguagesQuery = /* GraphQL */ `
    query GetRepoLanguages($login: String!) {
        user(login: $login) {
            repositories(first: 20, ownerAffiliations: OWNER) {
                nodes {
                    name
                    languages(first: 20) {
                        totalSize
                        edges {
                            size
                            node {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
