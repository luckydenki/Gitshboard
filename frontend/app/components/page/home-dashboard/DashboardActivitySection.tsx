import type { Commit } from "~/routes/new/types/commit";
import DashboardActivityArticle from "./DashboardActivityArticle";
import DashboardRecentActivitySection from "./DashboardRecentActivitySection";
import type { Issue } from "~/routes/new/types/issue";
import type { PullRequest } from "~/routes/new/types/pr";

export type ActivityItems = Array<Commit | Issue | PullRequest>;

export default function DashboardActivitySection() {
    const commits: Commit[] = [];
    for (let i = 0; i < 12; ++i) {
        commits.push({
            nameWithOwner: "flyetanol/Gitshboard",
            oid: "59671a2b4c8d9e0f1234567890abcdef12345678",
            abbreviatedOid: "59671a2",
            messageHeadline: "feat: 새로운 커밋",
            committedDate: "2017-09-01T00:00:00Z",
            committedViaWeb: false,
            url: "https://github.com/flyetanol/Gitshboard/commit/59671a2b4c8d9e0f1234567890abcdef12345678",
        });
    }

    return (
        <section className="grid min-w-sm grid-cols-[1fr_minmax(320px,2fr)] gap-8 not-lg:grid-cols-1">
            <DashboardActivityArticle />
            <DashboardRecentActivitySection data={commits} />
        </section>
    );
}
