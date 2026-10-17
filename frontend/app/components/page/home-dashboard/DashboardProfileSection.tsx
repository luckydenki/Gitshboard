import type { EChartsOption } from "echarts";
import DashboardContributionCalendarArticle from "./DashboardContributionCalendarArticle";
import DashboardProfileArticle from "./DashboardProfileArticle";

interface DashboardProfileSectionProps {
    name: string;
    bio: string;
    location: string;
    link: string[];
    following: number;
    followers: number;
}

export default function DashboardProfileSection({
    name,
    bio,
    location,
    link,
    following,
    followers,
}: DashboardProfileSectionProps) {
    return (
        <section className="bg-panel px-4 pt-8">
            <DashboardProfileArticle
                name={name}
                bio={bio}
                location={location}
                link={link}
                following={following}
                followers={followers}
            />
            <DashboardContributionCalendarArticle />
        </section>
    );
}
