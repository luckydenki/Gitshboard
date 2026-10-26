export const issueFlowMock = [
    { week: "1주", opened: 72, closed: 65 },
    { week: "2주", opened: 83, closed: 71 },
    { week: "3주", opened: 79, closed: 76 },
    { week: "4주", opened: 92, closed: 82 },
] as const;

export const issueAgeMock = [
    { label: "7일 이하", count: 126, percent: 15 },
    { label: "8~30일", count: 208, percent: 25 },
    { label: "31~90일", count: 246, percent: 29 },
    { label: "90일 초과", count: 262, percent: 31 },
] as const;

export const issueLabelsMock = [
    { label: "bug", count: 312, percent: 37 },
    { label: "feature", count: 224, percent: 27 },
    { label: "documentation", count: 118, percent: 14 },
    { label: "good first issue", count: 24, percent: 3 },
    { label: "기타", count: 164, percent: 19 },
] as const;

export const issueTypesMock = [
    { label: "bug", median: "2일 8시간", width: "35%" },
    { label: "feature", median: "7일 12시간", width: "100%" },
    { label: "documentation", median: "1일 15시간", width: "22%" },
] as const;

export const milestonesMock = [
    { name: "React 19.3", closed: 48, total: 60, percent: 80 },
    { name: "Compiler improvements", closed: 29, total: 50, percent: 58 },
    { name: "Documentation", closed: 17, total: 25, percent: 68 },
] as const;

export const prSizesMock = [
    { label: "작음 · 100줄 이하", count: 410, percent: 27 },
    { label: "보통 · 101~500줄", count: 535, percent: 36 },
    { label: "큼 · 501~1,000줄", count: 328, percent: 22 },
    { label: "매우 큼 · 1,000줄 초과", count: 223, percent: 15 },
] as const;

export const prMetricsMock = [
    { label: "Draft PR 비율", value: "17.8%", detail: "열린 PR 214건 중 38건" },
    {
        label: "변경 요청 후 수정",
        value: "중앙값 9시간",
        detail: "수정 커밋이 올라오기까지",
    },
    { label: "승인 없이 병합", value: "6.3%", detail: "병합된 PR 기준" },
    {
        label: "코드와 테스트 함께 변경",
        value: "64%",
        detail: "코드 변경 PR 기준",
    },
    {
        label: "코드와 문서 함께 변경",
        value: "28%",
        detail: "코드 변경 PR 기준",
    },
    {
        label: "외부 기여자 PR 병합률",
        value: "72%",
        detail: "외부 기여자 작성 PR 기준",
    },
    { label: "봇 PR 비율", value: "19%", detail: "전체 PR 기준" },
    {
        label: "Dependabot PR 처리",
        value: "중앙값 1일 8시간",
        detail: "생성부터 병합·종료까지",
    },
] as const;

export const issueTotalsMock = [
    { label: "열린 Issue", value: "842", detail: "현재 해결 대기 중" },
    { label: "닫힌 Issue", value: "2,934", detail: "전체 기간 누적" },
    { label: "전체 Issue", value: "3,776", detail: "열린 건 + 닫힌 건" },
] as const;

export const issueProcessingMock = [
    {
        term: "Issue 해결률",
        value: "90.2%",
        detail: "최근 4주 종료 ÷ 신규",
    },
    { term: "순증감량", value: "+32건", detail: "신규 326 − 종료 294" },
    {
        term: "Issue → PR",
        value: "61%",
        detail: "최근 4주 신규 Issue 중 PR 연결",
    },
] as const;

export const issueAssignmentsMock = [
    {
        term: "담당자 없음",
        value: "218건",
        detail: "열린 Issue의 25.9%",
    },
    {
        term: "good first issue",
        value: "24건",
        detail: "신규 기여자용 라벨",
    },
] as const;

export const issueCommentDistributionMock = [
    { label: "0개", value: "22%", width: "22%" },
    { label: "1~3개", value: "43%", width: "43%" },
    { label: "4~9개", value: "25%", width: "25%" },
    { label: "10개 이상", value: "10%", width: "10%" },
] as const;

export const popularIssuesMock = [
    {
        title: "Suspense boundary behavior in concurrent updates",
        number: "#34860",
        comments: 48,
    },
    {
        title: "Server Actions error handling proposal",
        number: "#34782",
        comments: 36,
    },
    {
        title: "Improve hydration warning details",
        number: "#34691",
        comments: 29,
    },
] as const;

export const issueCloseReasonsMock = [
    { term: "수정 완료", value: "72%" },
    { term: "중복", value: "15%" },
    { term: "무효", value: "8%" },
    { term: "재현 불가", value: "5%" },
] as const;

export const pullRequestTotalsMock = [
    { label: "열린 PR", value: "214", detail: "현재 리뷰·수정 진행 중" },
    { label: "병합된 PR", value: "1,086", detail: "전체 기간 누적" },
    { label: "병합 없이 닫힌 PR", value: "196", detail: "거절·중단 포함" },
] as const;

export const prTimelineMock = [
    { label: "PR 생성", value: "0시간" },
    { label: "첫 리뷰", value: "6시간 42분" },
    { label: "병합", value: "2일 11시간" },
] as const;

export const prReviewMetricsMock = [
    { term: "리뷰", value: "평균 2.8회" },
    { term: "댓글", value: "평균 5.4개" },
    { term: "참여자", value: "평균 3.2명" },
] as const;

export const mergeMethodsMock = [
    { term: "Squash", value: "72%" },
    { term: "Merge", value: "21%" },
    { term: "Rebase", value: "7%" },
] as const;

export const summaryMock = {
    issueCloseDistribution: "수정 완료 72%, 중복 15%, 무효 8%, 재현 불가 5%",
    prOutcomeDistribution: "병합 84.7%, 거절·중단 15.3%",
    mergeMethodDistribution: "squash 72%, merge 21%, rebase 7%",

    issuePeriod: "최근 4주 기준",
    openedIssues: "326",
    closedIssues: "294",
    firstResponseTime: "4시간 18분",
    assigneeTime: "1일 6시간",
    issueCloseTime: "3일 7시간",
    oldestIssue: "24일",
    inactiveIssueCount: "126건",
    reopenedRate: "8.1%",
    decidedPrPeriod: "결과가 결정된 PR 1,282건 기준",
    mergedRate: "84.7%",
    closedPrRate: "15.3%",
    firstReviewTime: "6시간 42분",
    mergeTime: "2일 11시간",
    longestPrTime: "14일 6시간",
    changedFiles: "평균 변경 파일 8.4개",
    smallPrMergeTime: "1일 4시간",
    largePrMergeTime: "5일 8시간",
    linkedIssues: "617건",
    linkedPrs: "493건",
};

export const barWidthsMock = ["72%", "15%", "8%", "5%", "84.7%", "15.3%", "72%", "21%", "7%"];
