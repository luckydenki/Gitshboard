import DashboardCommitArticle from "./DashboardCommitArticle";

interface DashboardRecentCommitsSectionProps {
    commits: Array<{
        sha: string;
        repository: string;
        message: string;
        date: string;
        type: string;
        url: string;
    }>;
}

export default function DashboardRecentCommitsSection({
    commits,
}: DashboardRecentCommitsSectionProps) {
    return (
        <section>
            <h3 className="mb-2 text-xl"> 최근 커밋 내역 </h3>

            <ul className="divide-y divide-gray-200">
                {commits.map((commit) => (
                    <DashboardCommitArticle
                        key={`${commit.repository}-${commit.sha}`}
                        commit={commit}
                    />
                ))}
            </ul>
        </section>
    );
}
