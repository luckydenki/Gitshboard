export interface UserOrganization {
    avatarurl: string;
    id: number;
    name: string | null;
    login: string;
    followers: number;
    public_repo: number;
    url: string;
    description: string | null;
}

export interface GetUserOrganizationsDto {
    orgs: UserOrganization[];
    totalOrgCount: number;
}
