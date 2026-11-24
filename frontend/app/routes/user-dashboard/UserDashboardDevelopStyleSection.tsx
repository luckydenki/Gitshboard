import PanelLayout from "~/components/common/DashboardPanelLayout";
import {
    workTypesMock,
    developStyleTopPanelsMock,
    collaborationStatsMock,
    developStyleSummaryMock,
} from "~/mock/home-dashboard/dashboard-develop-style";
import UserDashboardDevelopStyleActivityRhythm from "../../components/page/user-dashboard/UserDashboardDevelopStyleActivityRhythm";
import UserDashboardDevelopStyleLanguageChart from "../../components/page/user-dashboard/UserDashboardDevelopStyleLanguageChart";
import { useParams } from "react-router";

export default function UserDashboardDevelopStyleSection() {
    const params = useParams() as { user: string };
    return (
        <>
            <meta
                name="description"
                content={`${params.user}의 개발 성향 분석`}
            />
            <section>
                <section className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
                    {developStyleTopPanelsMock.map((panel) => (
                        <PanelLayout
                            key={panel.id}
                            title={panel.title}
                            semititle={panel.description}
                            footer={`분석 기간 ${panel.from} ~ ${panel.to}`}>
                            {panel.id === "1" ? (
                                <UserDashboardDevelopStyleLanguageChart />
                            ) : (
                                <div className="h-52" />
                            )}
                        </PanelLayout>
                    ))}
                    <UserDashboardDevelopStyleActivityRhythm />
                </section>
                {/* 아래 내용은 개발 성향 화면을 위한 예시 데이터입니다. */}
                <section className="mt-8 flex min-w-0 flex-col gap-8">
                    <div className="flex flex-col gap-6 lg:flex-row [&>section]:flex-1">
                        <PanelLayout
                            title="어떤 작업을 많이 할까요?"
                            semititle="PR의 주요 목적을 기준으로 살펴봐요."
                            footer={
                                <>
                                    예시 PR {developStyleSummaryMock.pullRequestCount}건 · 작업 유형
                                    분류는 추후 분석 결과를 연결할 수 있어요.
                                </>
                            }>
                            <div
                                className="mt-6 flex h-3 overflow-hidden rounded-lg bg-gray-300"
                                aria-label="작업 유형별 예시 PR 수">
                                {workTypesMock.map((item) => (
                                    <div
                                        key={item.label}
                                        className={item.color}
                                        style={{
                                            width: `${(item.count / developStyleSummaryMock.pullRequestCount) * 100}%`,
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="mt-6 flex flex-col gap-4">
                                {workTypesMock.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`h-2.5 w-2.5 rounded-lg ${item.color}`}
                                                aria-hidden="true"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {item.label}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-inherit">
                                            {item.count}건
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-sm leading-6 text-gray-500">
                                <span className="font-semibold">
                                    {developStyleSummaryMock.primaryWorkType}
                                </span>
                                와 함께 기존 코드 개선에도 시간을 쓰고 있어요.
                            </div>
                        </PanelLayout>
                    </div>

                    <PanelLayout
                        title="함께 만드는 방식"
                        semititle="코드 작성부터 리뷰까지, 협업에서 보이는 나의 모습이에요.">
                        <div className="mt-6 flex flex-col gap-4 divide-y divide-gray-300 sm:flex-row sm:divide-x sm:divide-y-0">
                            {collaborationStatsMock.map((item) => (
                                <div
                                    key={item.title}
                                    className="min-w-0 flex-1 p-4">
                                    <span className="text-sm text-gray-500">{item.title}</span>
                                    <p className="mt-4 text-2xl font-bold text-inherit">
                                        {item.number}
                                        <span className="ml-0.5 text-sm font-medium text-gray-500">
                                            {item.unit}
                                        </span>
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {item.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </PanelLayout>

                    <p className="text-xs leading-5 text-gray-500">
                        이 화면의 수치와 성향은 디자인을 위한 예시입니다. GitHub 기록은 실제 개발
                        활동의 일부만 보여줍니다.
                    </p>
                </section>
            </section>
        </>
    );
}
