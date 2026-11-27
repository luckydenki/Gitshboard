import UserDashboardDevelopStyleQueryState from "~/components/page/user-dashboard/UserDashboardDevelopStyleQueryState";
import PanelLayout from "~/components/common/DashboardPanelLayout";
import UpcomingBackdrop from "~/components/common/UpcomingBackdrop";
import { useParams } from "react-router";
import { useUserDevelopStyle } from "~/hooks/api/useUserDevelopStyle";
import UserDashboardDevelopStyleHourlyChart from "~/components/page/user-dashboard/UserDashboardDevelopStyleHourlyChart";
import UserDashboardDevelopStyleWeeklyChart from "~/components/page/user-dashboard/UserDashboardDevelopStyleWeeklyChart";
import UserDashboardDevelopStyleLanguageChart from "~/components/page/user-dashboard/UserDashboardDevelopStyleLanguageChart";

export default function UserDashboardDevelopStyleSection() {
    const { user = "" } = useParams();
    const query = useUserDevelopStyle(user);
    const data = query.data;
    if (!data)
        return (
            <UserDashboardDevelopStyleQueryState
                state={query.isPending || query.isFetching ? "loading" : "error"}
                onRetry={() => {
                    void query.refetch();
                }}
            />
        );
    const period = `${data.coverage.from.slice(0, 10)} ~ ${data.coverage.to.slice(0, 10)}`;
    const activityFooter = `${period} · ${data.coverage.timezone} · 공개 이벤트 ${data.coverage.events}건 표본${data.coverage.eventsLimited ? " · 최대 300건 도달" : ""}`;
    return (
        <>
            <meta
                name="description"
                content={`${user}의 개발 성향 분석`}
            />
            <section className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
                <PanelLayout
                    title="주 사용 언어"
                    semititle="공개 소유 저장소의 코드 구성 비율 top 5"
                    footer={`조회 시점 기준 · 저장소 ${data.coverage.repositories}개${data.coverage.repositoriesLimited ? " · 일부 수집" : ""}`}>
                    {data.languages.length ? (
                        <UserDashboardDevelopStyleLanguageChart
                            languages={data.languages}
                            otherPercentage={data.otherPercentage}
                        />
                    ) : (
                        <p className="flex h-52 items-center text-sm text-gray-500">
                            분석할 언어 데이터가 없습니다.
                        </p>
                    )}
                </PanelLayout>
                <PanelLayout
                    title="주 관심사"
                    semititle="공개 소유 저장소 토픽 빈도 top 3"
                    footer="저장소 토픽 기준의 참고 지표이며 실제 관심사를 단정하지 않습니다.">
                    <ul className="flex min-h-52 flex-col justify-center gap-4">
                        {data.topics.map((topic) => (
                            <li
                                key={topic.name}
                                className="flex justify-between">
                                <span>{topic.name}</span>
                                <span className="text-sm text-gray-500">
                                    {topic.count}개 저장소
                                </span>
                            </li>
                        ))}
                        {!data.topics.length && (
                            <li className="text-sm text-gray-500">등록된 토픽이 없습니다.</li>
                        )}
                    </ul>
                </PanelLayout>
                <PanelLayout
                    title="시간대 별 활동"
                    semititle="0시부터 23시까지 공개 기여 이벤트 분포"
                    footer={activityFooter}>
                    {data.hourly.some((point) => point.count > 0) ? (
                        <UserDashboardDevelopStyleHourlyChart points={data.hourly} />
                    ) : (
                        <p className="flex h-72 items-center justify-center text-sm text-gray-500">
                            집계할 공개 활동이 없습니다.
                        </p>
                    )}
                </PanelLayout>
                <PanelLayout
                    title="요일 별 활동"
                    semititle="요일별 공개 기여 이벤트 분포"
                    footer={activityFooter}>
                    {data.weekly.some((point) => point.count > 0) ? (
                        <UserDashboardDevelopStyleWeeklyChart points={data.weekly} />
                    ) : (
                        <p className="flex h-72 items-center justify-center text-sm text-gray-500">
                            집계할 공개 활동이 없습니다.
                        </p>
                    )}
                </PanelLayout>
            </section>
            <section className="mt-8 flex min-w-0 flex-col gap-8">
                <PanelLayout
                    title="어떤 작업을 많이 할까요?"
                    semititle="PR의 주요 목적을 기준으로 살펴봐요.">
                    <UpcomingBackdrop />
                </PanelLayout>
                <PanelLayout
                    title="함께 만드는 방식"
                    semititle="공개 이벤트에서 확인한 협업 활동"
                    footer={activityFooter}>
                    <div className="mt-6 flex flex-col gap-4 divide-y divide-gray-300 sm:flex-row sm:divide-x sm:divide-y-0">
                        {[
                            {
                                title: "PR 작성",
                                number: data.collaboration.pullRequests,
                                unit: "개",
                                detail: "PR 생성 이벤트",
                            },
                            {
                                title: "코드 리뷰",
                                number: data.collaboration.reviews,
                                unit: "회",
                                detail: "리뷰 이벤트",
                            },
                            {
                                title: "외부 레포지토리",
                                number: data.collaboration.externalRepositories,
                                unit: "곳",
                                detail: "타인 소유 저장소의 공개 기여 이벤트",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="min-w-0 flex-1 p-4">
                                <span className="text-sm text-gray-500">{item.title}</span>
                                <p className="mt-4 text-2xl font-bold">
                                    {item.number}
                                    <span className="ml-0.5 text-sm text-gray-500">
                                        {item.unit}
                                    </span>
                                </p>
                                <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </PanelLayout>
                <p className="text-xs text-gray-500">
                    활동은 최근 30일 최대 300건 중 Push·PR·Issue·리뷰 이벤트 기준입니다. 커밋 수가
                    아니며 비공개 활동은 포함하지 않습니다. GitHub 반영에 지연이 있을 수 있습니다.
                    {!data.coverage.events && " 수집된 공개 활동이 없습니다."}
                </p>
            </section>
        </>
    );
}
