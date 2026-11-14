/** 조직 멤버 수. link : https://docs.github.com/en/graphql/reference/objects#organization */
export const githubOrgProfileMembersQuery = /* GraphQL */ `
    query OrgProfileMembers($login: String!) {
        organization(login: $login) {
            membersWithRole { totalCount }
        }
    }
`;
