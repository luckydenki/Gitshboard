import type { Profile } from "~/types/new/profile";
import DashboardContributionCalendarArticle from "./DashboardContributionCalendarArticle";
import DashboardProfileArticle from "./DashboardProfileArticle";
import { DashboardProfileSectionLayout } from "./DashboardProfileSectionLayout";

interface DashboardProfileSectionProps {
    profile: Profile;
}

export default function DashboardProfileSection({ profile }: DashboardProfileSectionProps) {
    return (
        <DashboardProfileSectionLayout>
            <DashboardProfileArticle
                name={profile.name ?? profile.login}
                bio={profile.bio ?? ""}
                location={profile.location ?? ""}
                link={profile.socialAccountsList ?? []}
                following={profile.followingTotal ?? 0}
                followers={profile.followersTotal ?? 0}
                url={profile.url}
                avatarUrl={profile.avatarUrl}
            />
            <DashboardContributionCalendarArticle />
        </DashboardProfileSectionLayout>
    );
}
