export const weeklyCommitsMock = [
    42, 38, 51, 46, 62, 70, 58, 64, 73, 68, 81, 77, 69, 75, 84, 91, 88, 79, 95, 102, 97, 108, 113,
    105, 119, 124, 116, 132, 127, 138, 144, 136, 129, 151, 147, 158, 162, 154, 169, 176, 164, 182,
    188, 174, 196, 203, 191, 212, 205, 219, 228, 214,
] as const;

export const commitRecordsMock = [
    { label: "활동한 날짜", value: "842일", detail: "전체 기간의 31.8%" },
    { label: "활동한 주", value: "148주", detail: "최근 3년 기준" },
    { label: "주당 평균 커밋", value: "124.5개", detail: "활동 주 기준" },
    {
        label: "활동일당 평균 커밋",
        value: "21.9개",
        detail: "커밋이 있던 날 기준",
    },
    { label: "가장 활발했던 주", value: "228개", detail: "2026년 41주차" },
    { label: "마지막 커밋", value: "2시간 전", detail: "main 브랜치" },
    {
        label: "최장 무커밋 기간",
        value: "11일",
        detail: "2024.12.22 ~ 2025.01.01",
    },
    { label: "연속 활동 주 기록", value: "48주", detail: "현재도 기록 중" },
] as const;

export const codeChangeTrendMock = [8_420, 10_180, 9_360, 12_740, 14_220, 16_480] as const;

export const commitsByTimeMock = [
    { time: "00시", count: 42 },
    { time: "04시", count: 18 },
    { time: "08시", count: 76 },
    { time: "12시", count: 148 },
    { time: "16시", count: 186 },
    { time: "20시", count: 104 },
] as const;

export const commitPeriodsMock = [
    { period: "최근 7일", value: "85", change: "+9.0%" },
    { period: "최근 30일", value: "356", change: "+12.7%" },
    { period: "최근 90일", value: "1,074", change: "+8.4%" },
] as const;

export const summaryMock = {
    codeChangeDistribution: "코드 추가 59%, 코드 정리 41%",

    totalCommits: "18,426",
    activeStreak: "48주 연속 활동 중",
    growthRate: "+12.4%",
    yearlyComparison: "최근 1년은 이전 1년보다 386개의 커밋이 더 등록됐어요.",
    yearlyCommits: "6,494",
    yearlyPeriod: "52주 합계",
    chartStart: "2025.11",
    chartMiddle: "2026.05",
    chartEnd: "2026.10",
    codeChangePeriod: "최근 6개월 순 코드 변화 추이",
    netCodeChange: "+126,537줄",
    codeGrowth: "최근 증가 속도 +8.7%",
    addedLines: "코드 추가 412,680줄",
    removedLines: "코드 정리 286,143줄",
    timePeriod: "최근 90일 커밋 시간을 기준으로 했어요.",
    peakTime: "16시",
    timeInsight: "전체 커밋의 58%가 12시부터 20시 사이에 등록됐어요.",
};

export const barWidthsMock = ["59%", "41%"];
