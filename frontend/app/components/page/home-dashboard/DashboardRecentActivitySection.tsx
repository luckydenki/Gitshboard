import type { Commit, Issue, PullRequest } from "~/routes/new/home-dashboard";
import DashboardCommitArticle from "./DashboardCommitArticle";

interface DashboardRecentCommitsSectionProps {
    data: Array<Commit | Issue | PullRequest>;
}

export default function DashboardRecentActivitySection({
    data,
}: DashboardRecentCommitsSectionProps) {
    return (
        <section>
            <div className="flex justify-between">
                <h3 className="mb-2 text-xl"> 최근 활동 내역 </h3>
                <label className="space-x-2">
                    <span>분류</span>
                    <select
                        id="category"
                        className="rounded-lg">
                        <option>전체</option>
                        <option>커밋</option>
                        <option>이슈</option>
                        <option>풀 리퀘스트</option>
                    </select>
                </label>
            </div>

            <ul className="divide-y divide-gray-200">
                {data.map((e) => {
                    if ("repository" in e) {
                        return (
                            <DashboardCommitArticle
                                key={`${e.repository}-${e.sha}`}
                                commit={e}
                            />
                        );
                    } else {
                        return null;
                    }
                })}
            </ul>
        </section>
    );
}
