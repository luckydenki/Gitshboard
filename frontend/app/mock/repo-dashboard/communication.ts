export const contributorsMock = [
    { login: "gaearon", commits: 1_284, share: "18.2%" },
    { login: "sebmarkbage", commits: 976, share: "13.8%" },
    { login: "acdlite", commits: 641, share: "9.1%" },
    { login: "sophiebits", commits: 438, share: "6.2%" },
] as const;

export const contributorMetricsMock = [
    { label: "good first issue", value: "24건", detail: "열린 Issue 중" },
    { label: "help wanted", value: "41건", detail: "열린 Issue 중" },
    {
        label: "신규 기여자 PR 병합률",
        value: "72%",
        detail: "첫 PR의 처리 결과 기준",
    },
    {
        label: "첫 PR에 남긴 리뷰 댓글",
        value: "평균 4.6개",
        detail: "유지관리자 작성 댓글",
    },
    {
        label: "외부 기여자 재참여율",
        value: "38%",
        detail: "첫 기여 뒤 6개월 내 재참여",
    },
    {
        label: "작게 시작할 수 있는 Issue",
        value: "29%",
        detail: "작업 범위가 작은 열린 Issue",
    },
] as const;

export const issueReadinessMock = [
    { label: "담당자 명시", value: 63 },
    { label: "예상 난이도 명시", value: 52 },
    { label: "재현 절차 명시", value: 71 },
] as const;

export const discussionCategoriesMock = [
    { name: "Q&A", count: 156, percent: 40 },
    { name: "Ideas", count: 94, percent: 24 },
    { name: "Show and tell", count: 62, percent: 16 },
    { name: "Announcements", count: 43, percent: 11 },
    { name: "General", count: 32, percent: 9 },
] as const;

export const popularDiscussionsMock = [
    {
        title: "How to migrate an existing app to React 19?",
        category: "Q&A",
        replies: 42,
    },
    {
        title: "Share your React Compiler migration results",
        category: "Show and tell",
        replies: 36,
    },
    {
        title: "Proposal: improve transition debugging",
        category: "Ideas",
        replies: 31,
    },
] as const;

export const recurringTopicsMock = [
    { topic: "React 19 마이그레이션", count: 38 },
    { topic: "React Compiler 설정", count: 27 },
    { topic: "서버 컴포넌트", count: 19 },
    { topic: "Hydration 오류", count: 15 },
] as const;

export const summaryMock = {
    contributorTotal: "총 1,842명",
    firstContributionDescription: "문서 예제의 혼동되는 부분을 고친 작은 변경이었어요.",

    readinessInsight: "세 정보가 모두 명확한 Issue는 46%예요.",
    firstContributionTitle: "docs: clarify the useTransition example",
    firstContributionReference: "@new-react-contributor · #34872",
    firstContributionReviews: "리뷰 댓글 5개",
    firstContributionMergeTime: "병합까지 2일 4시간",
    difficulty: "보통",
    difficultyInsight:
        "첫 기여용 Issue와 도움 요청이 꾸준히 열려 있고 첫 PR도 비교적 잘 병합돼요. 다만 담당자·난이도·재현 절차가 모두 명확한 Issue는 절반에 미치지 못해 작업을 고르는 데 시간이 걸릴 수 있어요.",
    difficultyEvidence:
        "근거: good first issue 24건 · help wanted 41건 · 첫 PR 병합률 72% · 안내 완성도 46%",
    totalDiscussions: "387개",
    answeredRate: "84%",
    firstAnswerTime: "3시간 12분",
    resolvedDiscussions: "71건",
    resolvedPeriod: "Issue로 옮기지 않고 Discussion 답변으로 해결한 문의는 최근 90일 기준이에요.",
    recurringTopicsPeriod: "최근 90일 Discussion에서 자주 등장했어요.",
    announcementsPeriod: "최근 6개월 게시 빈도",
    announcementCount: "12건",
    announcementAverage: "월평균 2.0건",
    releaseCount: "8건",
    releaseAverage: "월평균 1.3건",
};
