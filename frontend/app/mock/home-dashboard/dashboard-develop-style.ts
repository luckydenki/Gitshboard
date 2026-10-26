export const weeklyActivityMock = [
    { day: "월", count: 12 },
    { day: "화", count: 18 },
    { day: "수", count: 14 },
    { day: "목", count: 21 },
    { day: "금", count: 16 },
    { day: "토", count: 10 },
    { day: "일", count: 7 },
];

export const workTypesMock = [
    { label: "기능 추가", count: 14, color: "bg-primary" },
    { label: "버그 수정", count: 9, color: "bg-primary/75" },
    { label: "리팩터링", count: 6, color: "bg-primary/50" },
    { label: "테스트 · 문서", count: 5, color: "bg-primary/25" },
];

export const developStyleTopPanelsMock: Array<{
    id: string;
    title: string;
    description: string;
    from: string;
    to: string;
}> = [
    {
        id: "1",
        title: "주 사용 언어",
        description: "자주 사용하는 언어 top 5",
        from: "2025-10-17",
        to: "2026-10-17",
    },
    {
        id: "2",
        title: "주 관심사",
        description: "주요 관심 기술 top 3",
        from: "2025-10-17",
        to: "2026-10-17",
    },
    {
        id: "3",
        title: "주 사용 언어",
        description: "자주 사용하는 언어 top 5",
        from: "2025-10-17",
        to: "2026-10-17",
    },
];

export const collaborationStatsMock = [
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
];

export const developStyleSummaryMock = {
    peakDay: "목",
    peakDayLabel: "목요일",
    peakActivityCount: 21,
    activityCount: 98,
    pullRequestCount: 34,
    primaryWorkType: "기능 추가",
};
