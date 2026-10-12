import DashboardActivityArticle from "./DashboardActivityArticle";
import DashboardRecentCommitsSection from "./DashboardRecentCommitsSection";

interface DashboardActivitySectionProps {
    commits: Array<{
        sha: string;
        repository: string;
        message: string;
        date: string;
        type: string;
        url: string;
    }>;
}

export default function DashboardActivitySection({ commits }: DashboardActivitySectionProps) {
    return (
        <section className="grid min-w-24 grid-cols-[1fr_minmax(320px,2fr)] gap-4 not-lg:grid-cols-1">
            <DashboardActivityArticle />
            <DashboardRecentCommitsSection commits={commits} />
        </section>
    );
}
