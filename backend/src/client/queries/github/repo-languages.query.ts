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
