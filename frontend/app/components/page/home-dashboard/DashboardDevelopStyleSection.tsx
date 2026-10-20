import { useState } from "react";

const TopPanel = ({
    title,
    description,
    from,
    to,
    isLoading,
}: {
    title: string;
    description: string;
    from: string;
    to: string;
    isLoading: boolean;
}) => {
    return (
        <div className="bg-panel flex flex-col gap-2 rounded-lg px-4 py-4">
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <span className="text-sm text-gray-500">{description}</span>
            </div>
            <div
                className={
                    isLoading
                        ? `flex h-52 animate-pulse items-center justify-center rounded-lg bg-gray-200`
                        : `bg-panel flex h-52 items-center justify-center`
                }></div>
            <div className="text-sm text-gray-500">
                분석 기간 {from} ~ {to}
            </div>
        </div>
    );
};

export default function DashboardDevelopStyleSection() {
    const [isLoading, setIsLoading] = useState(false);
    const weeklyActivity = [
        { day: "월", count: 12 },
        { day: "화", count: 18 },
        { day: "수", count: 14 },
        { day: "목", count: 21 },
        { day: "금", count: 16 },
        { day: "토", count: 10 },
        { day: "일", count: 7 },
    ];
    const workTypes = [
        { label: "기능 추가", count: 14, color: "bg-primary" },
        { label: "버그 수정", count: 9, color: "bg-primary/75" },
        { label: "리팩터링", count: 6, color: "bg-primary/50" },
        { label: "테스트 · 문서", count: 5, color: "bg-primary/25" },
    ];

    return (
        <section>
            <section className="grid min-w-sm grid-cols-3 gap-8 not-lg:grid-cols-1">
                {/* <div className="preferencebox-border col-span-full flex flex-col rounded-lg border-2 border-transparent px-4 pt-4 pb-8">
                <div className="text-xl">나의 주 성향은...</div>
                <div className="self-center text-3xl">꾸준한 기여자</div>
            </div> */}

                <TopPanel
                    title="주 사용 언어"
                    description="자주 사용하는 언어 top 5"
                    from="2025-10-17"
                    to="2026-10-17"
                    isLoading={isLoading}
                />
                <TopPanel
                    title="주 관심사"
                    description="주요 관심 기술 top 3"
                    from="2025-10-17"
                    to="2026-10-17"
                    isLoading={isLoading}
                />

                <TopPanel
                    title="주 사용 언어"
                    description="자주 사용하는 언어 top 5"
                    from="2025-10-17"
                    to="2026-10-17"
                    isLoading={isLoading}
                />

                <div className="bg-panel col-span-full rounded-lg px-4 py-4">
                    <h3 className="mb-3 text-xl font-semibold">활동 리듬</h3>
                    <div className="grid h-48 grid-cols-3 divide-x divide-gray-300 not-lg:grid-cols-1 not-lg:divide-x-0 not-lg:divide-y">
                        <div className="px-4">
                            <h4 className="text-lg">시간대 별 활동</h4>
                            <span className="text-sm text-gray-500">
                                오전·오후·저녁·밤 중 활동이 많은 시간
                            </span>
                        </div>

                        <div className="px-4">
                            <h4 className="text-lg">요일 별 활동</h4>
                            <span className="text-sm text-gray-500">
                                평일과 주말, 요일별 활동 분포
                            </span>
                        </div>

                        <div className="px-4">
                            <h4 className="text-lg">기간 별 성향 변화</h4>
                            <span className="text-sm text-gray-500">
                                이전 기간과 비교해 활동 시간이나 방식이 어떻게 변했는지
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-panel py- col-span-full rounded-lg px-4 py-3">
                    <h3 className="text-xl font-semibold">코드 스타일</h3>
                </div>

                <div className="bg-panel py- col-span-full rounded-lg px-4 py-3">
                    <h3 className="text-xl font-semibold">협업 스타일</h3>
                </div>
            </section>

            {/* 아래 내용은 개발 성향 화면을 위한 예시 데이터입니다. */}
            <section
                aria-labelledby="develop-style-preview"
                className="mt-12 flex min-w-0 flex-col gap-6">
                <div className="rounded-lg border-1 border-gray-300 bg-panel p-6 sm:p-8">
                    <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex rounded-lg bg-primary/15 px-3 py-2 text-xs font-semibold text-primary">
                                나의 활동 한눈에 보기
                            </span>
                            <h3 id="develop-style-preview" className="mt-4 text-2xl leading-snug font-bold tracking-tight text-inherit sm:text-3xl">
                                꾸준히 만들고, 함께 성장하는 개발자
                            </h3>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                                여러 주에 걸쳐 프로젝트를 꾸준히 개선하고, 코드 리뷰를 통해 동료와
                                의견을 나누고 있어요.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {["# 꾸준한 기여", "# 협업 중심", "# 기능 개선"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg border-1 border-gray-300 bg-panel px-3 py-2 text-xs font-medium text-primary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-6 xl:min-w-80">
                            {[
                                { value: "19주", label: "활동한 주" },
                                { value: "34개", label: "작성한 PR" },
                                { value: "11회", label: "참여한 리뷰" },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xl font-bold text-inherit">{item.value}</p>
                                    <p className="mt-1 text-xs text-gray-500">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    <article className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-primary">
                                    ACTIVITY RHYTHM
                                </p>
                                <h3 className="mt-2 text-lg font-bold text-inherit">활동 리듬</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    언제 가장 활발하게 활동할까요?
                                </p>
                            </div>
                            <span className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                                요일별
                            </span>
                        </div>
                        <div className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-gray-500">
                            <span className="font-semibold text-primary">목요일</span>에 가장 많은
                            활동을 기록했어요.
                        </div>
                        <div
                            className="mt-6 flex h-36 items-end justify-around gap-3"
                            aria-label="요일별 예시 활동 수">
                            {weeklyActivity.map((item) => (
                                <div
                                    key={item.day}
                                    className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                    <span className="text-xs font-medium text-gray-500">
                                        {item.count}
                                    </span>
                                    <div
                                        className={`w-full max-w-8 rounded-lg ${item.day === "목" ? "bg-primary" : "bg-primary/15"}`}
                                        style={{ height: `${(item.count / 21) * 100}px` }}
                                    />
                                    <span className="text-xs text-gray-500">{item.day}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-xs leading-5 text-gray-500">
                            예시 활동 98건 · 커밋, PR, 이슈, 리뷰 기준
                        </p>
                    </article>

                    <article className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-6">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-primary">
                                WORK PATTERNS
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-inherit">
                                어떤 작업을 많이 할까요?
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                PR의 주요 목적을 기준으로 살펴봐요.
                            </p>
                        </div>
                        <div
                            className="mt-6 flex h-3 overflow-hidden rounded-lg bg-gray-300"
                            aria-label="작업 유형별 예시 PR 수">
                            {workTypes.map((item) => (
                                <div
                                    key={item.label}
                                    className={item.color}
                                    style={{ width: `${(item.count / 34) * 100}%` }}
                                />
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                            {workTypes.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-lg ${item.color}`}
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm text-gray-500">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-inherit">
                                        {item.count}건
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm leading-6 text-gray-500">
                            <span className="font-semibold text-primary">기능 추가</span>와 함께
                            기존 코드 개선에도 시간을 쓰고 있어요.
                        </div>
                        <p className="mt-5 text-xs leading-5 text-gray-500">
                            예시 PR 34건 · 작업 유형 분류는 추후 분석 결과를 연결할 수 있어요.
                        </p>
                    </article>
                </div>

                <article className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-primary">
                                COLLABORATION
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-inherit">
                                함께 만드는 방식
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                코드 작성부터 리뷰까지, 협업에서 보이는 나의 모습이에요.
                            </p>
                        </div>
                        <span className="rounded-lg bg-gray-300 px-3 py-2 text-xs font-medium text-gray-500">
                            예시 데이터
                        </span>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {[
                            {
                                number: "34",
                                unit: "개",
                                title: "PR 작성",
                                detail: "변경 사항을 공유했어요",
                                color: "bg-primary/10 text-primary",
                            },
                            {
                                number: "11",
                                unit: "회",
                                title: "코드 리뷰",
                                detail: "동료의 코드에 참여했어요",
                                color: "bg-primary/10 text-primary",
                            },
                            {
                                number: "4",
                                unit: "곳",
                                title: "외부 레포지토리",
                                detail: "다른 프로젝트에 기여했어요",
                                color: "bg-primary/10 text-primary",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="flex-1 rounded-lg border-1 border-gray-300 bg-panel p-4">
                                <span
                                    className={`inline-flex rounded-lg px-2 py-2 text-xs font-semibold ${item.color}`}>
                                    {item.title}
                                </span>
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
                </article>

                <p className="text-xs leading-5 text-gray-500">
                    이 화면의 수치와 성향은 디자인을 위한 예시입니다. GitHub 기록은 실제 개발 활동의
                    일부만 보여줍니다.
                </p>
            </section>
        </section>
    );
}
