import type { DashboardProfile } from "~/hooks/useUserDashboard";
import UserDashboardContributionCalendarArticle from "./UserDashboardContributionCalendarArticle";
import UserDashboardProfileArticle from "./UserDashboardProfileArticle";
import { UserDashboardProfileSectionLayout } from "./UserDashboardProfileSectionLayout";

interface UserDashboardProfileSectionProps {
    profile: DashboardProfile;
}

export default function UserDashboardProfileSection({ profile }: UserDashboardProfileSectionProps) {
    const links = [
        profile.websiteUrl,
        ...(profile.socialAccounts.nodes ?? []).map((account) => account?.url),
    ].filter((url): url is string => Boolean(url));

    return (
        <UserDashboardProfileSectionLayout>
            <UserDashboardProfileArticle
                login={profile.login}
                name={profile.name ?? profile.login}
                bio={profile.bio ?? ""}
                location={profile.location ?? ""}
                link={links}
                following={profile.followingTotal ?? profile.following.totalCount}
                followers={profile.followersTotal ?? profile.followers.totalCount}
                url={profile.url}
                avatarUrl={profile.avatarUrl}
            />
            <UserDashboardContributionCalendarArticle
                weeks={profile.contributionsCollection.contributionCalendar.weeks}
            />
        </UserDashboardProfileSectionLayout>
    );
}
