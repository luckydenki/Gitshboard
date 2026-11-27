import PanelLayout from "~/components/common/DashboardPanelLayout";
import UserDashboardInterestsViewedList from "~/components/page/user-dashboard/UserDashboardInterestsViewedList";
import UserDashboardInterestsRecommendationsSection from "~/components/page/user-dashboard/UserDashboardInterestsRecommendationsSection";
import UserDashboardInterestsTopicsChart from "~/components/page/user-dashboard/UserDashboardInterestsTopicsChart";

export default function UserDashboardInterestsSection() {
    return (
        <section
            aria-label="관심사"
            className="flex min-h-[50vh] min-w-0 flex-col gap-8">
            <PanelLayout
                title="나의 탐색 요약"
                semititle="최근 살펴본 프로젝트와 관심 주제"
                footer="예시 데이터 · 최근 30일">
                <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex min-w-0 flex-col justify-center gap-4 py-4">
                        <h4 className="text-lg font-medium">
                            요즘 프론트엔드에 관심이 많으시군요!
                        </h4>
                        <p className="text-sm leading-7 text-gray-500">
                            최근 찾아본 프로젝트에서 프론트엔드와 개발자 도구가 자주 등장했어요.
                            관심 주제를 바탕으로 새로운 프로젝트도 둘러보세요.
                        </p>
                        <ul
                            className="flex flex-wrap gap-4 text-sm text-gray-500"
                            aria-label="관심 주제">
                            {["프론트엔드", "개발자 도구", "데이터 시각화"].map((tag) => (
                                <li key={tag}># {tag}</li>
                            ))}
                        </ul>
                    </div>
                    <section className="min-w-0">
                        <h4 className="text-lg font-medium">많이 살펴본 주제</h4>
                        <p className="text-sm text-gray-500">조회 기록 기준</p>
                        <UserDashboardInterestsTopicsChart />
                    </section>
                </div>
            </PanelLayout>
            <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
                <UserDashboardInterestsViewedList kind="repositories" />
                <UserDashboardInterestsViewedList kind="users" />
            </div>
            <UserDashboardInterestsRecommendationsSection />
            <p className="text-xs leading-5 text-gray-500">
                이 화면의 조회 기록과 추천은 디자인을 위한 예시입니다. 관심사는 전적을 조회하는
                사용자의 사이트 이용 기록을 기준으로 표시할 수 있어요.
            </p>
        </section>
    );
}
