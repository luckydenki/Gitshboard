import type { Commit, Issue, PullRequest } from "~/routes/new/home-dashboard";
import DashboardActivityArticle from "./DashboardActivityArticle";
import DashboardRecentActivitySection from "./DashboardRecentActivitySection";

interface DashboardActivitySectionProps {
    data: Array<Commit | Issue | PullRequest>;
}

export default function DashboardActivitySection({ data }: DashboardActivitySectionProps) {
    return (
        <section className="grid min-w-sm grid-cols-[1fr_minmax(320px,2fr)] gap-8 not-lg:grid-cols-1">
            <DashboardActivityArticle />
            <DashboardRecentActivitySection data={data} />
        </section>
    );
}
