import type { GithubGQLOrgProfileDetailsQuery as OrgProfileDetailsQuery, GithubGQLOrgProfileMembersQuery as OrgProfileMembersQuery } from "../github/graphql/operations.generated";

export type GetOrgProfileDto = {
    organization: (NonNullable<OrgProfileDetailsQuery["organization"]> & {
        membersWithRole: NonNullable<OrgProfileMembersQuery["organization"]>["membersWithRole"] | null;
    }) | null;
};
