import type { Profile } from "~/types/profile";
import UserDashboardContributionCalendarArticle from "./UserDashboardContributionCalendarArticle";
import UserDashboardProfileArticle from "./UserDashboardProfileArticle";
import { UserDashboardProfileSectionLayout } from "./UserDashboardProfileSectionLayout";

interface UserDashboardProfileSectionProps {
    profile: Profile;
}

export default function UserDashboardProfileSection({ profile }: UserDashboardProfileSectionProps) {
    return (
        <UserDashboardProfileSectionLayout>
            <UserDashboardProfileArticle
                login={profile.login}
                name={profile.name ?? profile.login}
                bio={profile.bio ?? ""}
                location={profile.location ?? ""}
                link={profile.socialAccountsList ?? []}
                following={profile.followingTotal ?? profile.following.totalCount}
                followers={profile.followersTotal ?? profile.followers.totalCount}
                url={profile.url}
                avatarUrl={profile.avatarUrl}
            />
            <UserDashboardContributionCalendarArticle />
        </UserDashboardProfileSectionLayout>
    );
}
