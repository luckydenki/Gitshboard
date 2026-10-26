export const languagesMock = [
    { name: "JavaScript", percent: 63.4, color: "bg-gray-600" },
    { name: "TypeScript", percent: 28.1, color: "bg-gray-400" },
    { name: "CSS", percent: 5.7, color: "bg-gray-300" },
    { name: "기타", percent: 2.8, color: "bg-primary" },
] as const;

export const fileTypesMock = [
    { label: "소스", count: "8,940", percent: 68, color: "bg-gray-600" },
    { label: "테스트", count: "2,104", percent: 16, color: "bg-gray-400" },
    { label: "문서", count: "1,183", percent: 9, color: "bg-gray-300" },
    { label: "설정", count: "918", percent: 7, color: "bg-primary" },
] as const;

export const fileCountTrendMock = [
    { month: "5월", value: 12_582 },
    { month: "6월", value: 12_694 },
    { month: "7월", value: 12_771 },
    { month: "8월", value: 12_918 },
    { month: "9월", value: 13_036 },
    { month: "10월", value: 13_145 },
] as const;

export const storageTrendMock = [
    { month: "5월", value: 250 },
    { month: "6월", value: 256 },
    { month: "7월", value: 263 },
    { month: "8월", value: 269 },
    { month: "9월", value: 277 },
    { month: "10월", value: 284 },
] as const;

export const growthMonthsMock = ["5월", "6월", "7월", "8월", "9월", "10월"];

export const deploymentHoursMock = [
    { label: "00~06시", count: 4 },
    { label: "06~12시", count: 12 },
    { label: "12~18시", count: 58 },
    { label: "18~24시", count: 26 },
] as const;

export const frameworksMock = ["React", "Rollup", "Babel", "Jest", "ESLint", "Yarn"] as const;

export const issuePrTotalsMock = [
    { label: "열린 Issue", value: "842" },
    { label: "종료된 Issue", value: "2,934" },
    { label: "열린 PR", value: "214" },
    { label: "병합된 PR", value: "1,086" },
] as const;

export const healthFilesMock = [
    "README",
    "LICENSE",
    "CONTRIBUTING",
    "CODE_OF_CONDUCT",
    "SECURITY",
] as const;

export const deploymentMetricsMock = [
    {
        label: "배포 소요 시간",
        value: "8분 42초",
        detail: "시작부터 완료까지 중앙값",
    },
    {
        label: "커밋 → 배포",
        value: "2시간 16분",
        detail: "main 반영부터 production까지 중앙값",
    },
    {
        label: "가장 활발한 배포 시간",
        value: "목요일 16시",
        detail: "최근 배포 기록 기준",
    },
] as const;

export const issueParticipantTrendMock = [174, 189, 198, 212, 237, 264];

export const prParticipantTrendMock = [126, 139, 147, 168, 181, 198];

export const contributorGrowthTrendMock = [1532, 1594, 1648, 1716, 1781, 1842];

export const summaryMock = {
    defaultBranch: "main",
    staleBranchName: "legacy/server-rendering",
    experimentalBranchName: "experiment/cache",

    filePeriod: "최근 6개월 파일 수 변화",
    fileCount: "13,145",
    fileGrowth: "6개월간 +563",
    frameworkEvidence: "package.json, rollup.config.js 외 8개 설정 파일 분석",
    storagePeriod: "서비스가 수집한 최근 6개월 디스크 사용량",
    storageSize: "284 MB",
    storageGrowth: "6개월간 +34 MB",
    healthScore: "5/5",
    activeBranchPeriod: "최근 30일 커밋 기준 활성 브랜치",
    branchCount: "238개",
    activeBranchCount: "42개",
    staleBranchPeriod: "180일 이상 변경 없는 브랜치",
    staleBranchCount: "19개",
    staleBranchLastCommit: "248일 전",
    experimentalBranchLastCommit: "213일 전",
    deploymentPeriod: "최근 90일 production 배포",
    deploymentSuccessRate: "98.4%",
    deploymentSuccessDetail: "배포 성공률 · 124회 중 122회 성공",
    contributorPeriod: "최근 6개월",
    contributorCount: "1,842명",
    contributorGrowth: "6개월간 +310명",
    deploymentFrequencyPeriod: "최근 90일 production 배포 기준",
    deploymentFrequency: "주 평균 9.6회",
};
