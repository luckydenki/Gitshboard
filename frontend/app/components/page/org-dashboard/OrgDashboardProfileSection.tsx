import OrgDashboardProfileArticle from "./OrgDashboardProfileArticle";
import { AccountDashboard } from "~/components/compound/AccountDashboardProfile";

export default function OrgDashbaordProfileSection({
    profile,
}: {
    profile: {
        avatarUrl: string;
        login: string;
        name: string;
        location: string;
        link: Array<string>;
        githubUrl: string;
        introduce: string;
    };
}) {
    return (
        <>
            <AccountDashboard.SectionLayout>
                <OrgDashboardProfileArticle
                    avatarUrl={profile.avatarUrl}
                    githubUrl={profile.githubUrl}
                    introduce={profile.introduce}
                    link={profile.link}
                    location={profile.location}
                    login={profile.login}
                    name={profile.name}
                />

                <div className="h-48">그냥 빈 공간</div>
            </AccountDashboard.SectionLayout>
        </>
    );
}
