export const weeklyActivityMock = [
    { day: "월", count: 12 },
    { day: "화", count: 18 },
    { day: "수", count: 14 },
    { day: "목", count: 21 },
    { day: "금", count: 16 },
    { day: "토", count: 10 },
    { day: "일", count: 7 },
];

export const languageUsageMock = [
    { language: "TypeScript", percentage: 42, color: "#3178c6" },
    { language: "JavaScript", percentage: 25, color: "#b89b00" },
    { language: "Python", percentage: 15, color: "#3572a5" },
    { language: "CSS", percentage: 8, color: "#663399" },
    { language: "HTML", percentage: 6, color: "#e34c26" },
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

export const hourlyActivityMock = [
    { hour: 0, count: 3 },
    { hour: 1, count: 2 },
    { hour: 2, count: 1 },
    { hour: 3, count: 0 },
    { hour: 4, count: 0 },
    { hour: 5, count: 0 },
    { hour: 6, count: 1 },
    { hour: 7, count: 2 },
    { hour: 8, count: 3 },
    { hour: 9, count: 5 },
    { hour: 10, count: 7 },
    { hour: 11, count: 6 },
    { hour: 12, count: 4 },
    { hour: 13, count: 5 },
    { hour: 14, count: 8 },
    { hour: 15, count: 9 },
    { hour: 16, count: 8 },
    { hour: 17, count: 6 },
    { hour: 18, count: 4 },
    { hour: 19, count: 3 },
    { hour: 20, count: 4 },
    { hour: 21, count: 5 },
    { hour: 22, count: 7 },
    { hour: 23, count: 5 },
];
