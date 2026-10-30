import { useState } from "react";
import DashboardRecentActivityList, {
    type DashboardActivityEvent,
} from "~/components/common/DashboardRecentActivityList";
import type { ActivityItems } from "./DashboardActivitySection";

interface DashboardRecentCommitsSectionProps {
    data: ActivityItems;
}

export default function DashboardRecentActivitySection({
    data,
}: DashboardRecentCommitsSectionProps) {
    const [category, setCategory] = useState("all");
    const events = data.map<DashboardActivityEvent>((activity, index) => {
        if ("oid" in activity) {
            return {
                id: `${activity.url}:${index}`,
                type: "commit",
                label: "Commit",
                title: activity.messageHeadline,
                description: `${activity.nameWithOwner} · ${activity.committedViaWeb ? "Web" : "Git"}`,
                reference: activity.abbreviatedOid,
                time: new Date(activity.committedDate).toLocaleString("ko-KR"),
                dateTime: activity.committedDate,
                url: activity.url,
            };
        }

        const isPullRequest = "merged" in activity;
        return {
            id: `${activity.url}:${index}`,
            type: isPullRequest ? "pull-request" : "issue",
            label: isPullRequest ? "Pull Request" : "Issue",
            title: activity.title,
            description: `${activity.repository.nameWithOwner} · ${activity.state} · 댓글 ${activity.comments.totalCount}개`,
            reference: `#${activity.number}`,
            time: new Date(activity.updatedAt).toLocaleString("ko-KR"),
            dateTime: activity.updatedAt,
            actor: activity.author?.login,
            url: activity.url,
        };
    });
    const visibleEvents = events.filter((event) => category === "all" || event.type === category);

    return (
        <section className="bg-panel min-w-0 flex-1 p-6 not-lg:w-full">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold sm:text-2xl">최근 활동 내역</h3>
                    <p className="text-sm text-gray-500">사용자의 주요 활동을 보여줘요.</p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <span>분류</span>
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="bg-panel cursor-pointer rounded-lg border border-gray-300 p-2">
                        <option value="all">전체</option>
                        <option value="commit">커밋</option>
                        <option value="issue">이슈</option>
                        <option value="pull-request">풀 리퀘스트</option>
                    </select>
                </label>
            </div>

            <DashboardRecentActivityList events={visibleEvents} />
        </section>
    );
}
