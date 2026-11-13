/** 조직 대시보드에 사용할 공개 프로필 정보를 조회합니다. */
export const orgDashboardProfileQuery = /* GraphQL */ `
    query GetOrgDashboardProfile($login: String!) {
        organization(login: $login) {
            login
            name
            avatarUrl(size: 160)
            url
            description
            location
            websiteUrl
            createdAt
        }
    }
`;
