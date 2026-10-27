import DashboardCommitArticle from "../DashboardCommitArticle";

import type { ActivityItems } from "./DashboardActivitySection";

interface DashboardRecentCommitsSectionProps {
    data: ActivityItems;
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
                {data.map((e, idx) => {
                    if ("nameWithOwner" in e) {
                        return (
                            //TODO : 임시적으로 키값 인덱스로 부여했습니다. 주의하세요
                            <DashboardCommitArticle
                                key={idx}
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
