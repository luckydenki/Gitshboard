import type { Commit } from "~/types/commit";
import UserDashboardActivityArticle from "../UserDashboardActivityArticle";
import UserDashboardRecentActivitySection from "./UserDashboardRecentActivitySection";
import type { Issue } from "~/types/issue";
import type { PullRequest } from "~/types/pr";

export type ActivityItems = Array<Commit | Issue | PullRequest>;

export default function UserDashboardActivitySection() {
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
        <section className="flex min-w-sm items-start gap-6 not-lg:flex-col">
            <UserDashboardActivityArticle />
            <UserDashboardRecentActivitySection data={commits} />
        </section>
    );
}
