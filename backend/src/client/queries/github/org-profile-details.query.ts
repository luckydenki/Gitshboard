/** 조직 공개 프로필 정보. link : https://docs.github.com/en/graphql/reference/objects#organization */
export const githubOrgProfileDetailsQuery = /* GraphQL */ `
    query OrgProfileDetails($login: String!) {
        organization(login: $login) {
            login
            name
            avatarUrl(size: 160)
            url
            description
            location
            websiteUrl
            twitterUsername
            repositories(privacy: PUBLIC) { totalCount }
            createdAt
        }
    }
`;
