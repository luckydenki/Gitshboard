import { FiGitCommit } from "react-icons/fi";
import type { Commit } from "~/types/new/commit";

interface DashboardCommitArticleProps {
    commit: Commit;
}

export default function DashboardCommitArticle({ commit }: DashboardCommitArticleProps) {
    return (
        <li className="bg-panel rounded-lg p-4">
            <article className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <FiGitCommit
                            size={18}
                            className="shrink-0 text-gray-500"
                            aria-hidden="true"
                        />
                        <span className="text-md truncate font-medium">{commit.nameWithOwner}</span>
                    </div>

                    <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 font-mono text-xs text-gray-500 hover:underline"
                        aria-label={`View commit ${commit.abbreviatedOid}`}>
                        {commit.abbreviatedOid}
                    </a>
                </div>

                <p className="text-sm font-medium wrap-break-word text-gray-900">
                    {commit.messageHeadline}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <time
                        dateTime={commit.committedDate}
                        className="text-xs text-gray-500">
                        {new Date(commit.committedDate).toLocaleString()}
                    </time>

                    <span className="rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-600">
                        {commit.committedViaWeb ? "Web" : "Git"}
                    </span>
                </div>
            </article>
        </li>
    );
}
