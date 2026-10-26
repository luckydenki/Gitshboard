export const weeklyActivityMock = [
    { day: "월", count: 8 },
    { day: "화", count: 14 },
    { day: "수", count: 11 },
    { day: "목", count: 19 },
    { day: "금", count: 16 },
    { day: "토", count: 7 },
    { day: "일", count: 10 },
] as const;

export const activityEventsMock = [
    {
        type: "commit",
        label: "Commit",
        title: "feat: add Activity component to the public API",
        description: "packages/react/src/ReactClient.js 외 4개 파일 변경",
        actor: "gaearon",
        reference: "8c21f4a",
        time: "오늘 14:32",
    },
    {
        type: "pull-request",
        label: "Pull Request",
        title: "Improve hydration error messages for nested boundaries",
        description: "리뷰 4개를 거쳐 main 브랜치에 병합됨",
        actor: "acdlite",
        reference: "#34918",
        time: "오늘 12:08",
    },
    {
        type: "issue",
        label: "Issue",
        title: "useEffect cleanup runs twice in development mode",
        description: "bug 라벨과 Status: Unconfirmed 라벨로 등록됨",
        actor: "dev-user",
        reference: "#34917",
        time: "오늘 10:41",
    },
    {
        type: "commit",
        label: "Commit",
        title: "fix: preserve pending state after interrupted transition",
        description: "ReactFiberLane.js 외 2개 파일 변경",
        actor: "sebmarkbage",
        reference: "f173bd2",
        time: "어제 21:17",
    },
    {
        type: "pull-request",
        label: "Pull Request",
        title: "Add regression test for deferred value update",
        description: "CI 검사를 통과하고 리뷰를 기다리는 중",
        actor: "sophiebits",
        reference: "#34912",
        time: "어제 18:56",
    },
    {
        type: "issue",
        label: "Issue",
        title: "Documentation example uses a removed option",
        description: "documentation 라벨로 분류된 뒤 종료됨",
        actor: "react-helper",
        reference: "#34908",
        time: "어제 15:24",
    },
] as const;

export const activityTagsMock = ["활발한 프로젝트", "꾸준한 커밋", "빠른 이슈 응답"] as const;

export const summaryMock = {
    rhythmBadge: "꾸준함",

    statusInsight: "최근 7일 동안 커밋, PR, 이슈 활동이 모두 확인됐어요.",
    rhythm: "평일 집중형",
    rhythmInsight: "전체 활동의 76%가 평일에 기록되며 오후 시간대가 가장 활발해요.",
    weeklyPeriod: "최근 7일",
    weeklyCommits: "85",
    peakDay: "목요일",
    peakCount: "19회",
    peakBreakdown: "커밋 14 · PR 3 · 이슈 2",
    commitCount: "12",
    pullRequestCount: "3",
    issueCount: "2",
};
