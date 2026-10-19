export const trendingLanguagesMock = [
    { name: "TypeScript", repositories: 18, share: 82 },
    { name: "Python", repositories: 14, share: 64 },
    { name: "Rust", repositories: 9, share: 41 },
    { name: "Go", repositories: 6, share: 27 },
];

export const trendingTopicsMock = [
    { name: "AI 에이전트", repositories: 16, change: "+8" },
    { name: "개발자 도구", repositories: 12, change: "+5" },
    { name: "로컬 우선", repositories: 8, change: "+3" },
    { name: "데이터 시각화", repositories: 6, change: "+2" },
    { name: "웹 프레임워크", repositories: 5, change: "+2" },
];

export const newlyDiscoveredRepositoriesMock = [
    {
        name: "browser-use/browser-use",
        description: "AI 에이전트가 웹 브라우저를 다룰 수 있도록 돕는 도구",
        language: "Python",
        discoveredAt: "오늘 발견",
        url: "https://github.com/browser-use/browser-use",
    },
    {
        name: "getzep/graphiti",
        description: "시간 흐름을 반영하는 지식 그래프 프레임워크",
        language: "Python",
        discoveredAt: "오늘 발견",
        url: "https://github.com/getzep/graphiti",
    },
    {
        name: "microsoft/markitdown",
        description: "다양한 파일을 Markdown으로 변환하는 유틸리티",
        language: "Python",
        discoveredAt: "이번 주 발견",
        url: "https://github.com/microsoft/markitdown",
    },
];

export const contributionIssuesMock = [
    {
        repository: "facebook/react",
        title: "초보 기여자가 살펴볼 수 있는 열린 이슈",
        labels: ["good first issue", "help wanted"],
        updatedAt: "최근 업데이트",
        url: "https://github.com/facebook/react/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22",
    },
    {
        repository: "vitejs/vite",
        title: "문서와 개발 경험 개선에 기여할 수 있는 이슈",
        labels: ["good first issue", "documentation"],
        updatedAt: "이번 주 업데이트",
        url: "https://github.com/vitejs/vite/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22",
    },
    {
        repository: "pnpm/pnpm",
        title: "도움이 필요한 공개 이슈 살펴보기",
        labels: ["help wanted"],
        updatedAt: "이번 주 업데이트",
        url: "https://github.com/pnpm/pnpm/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22help+wanted%22",
    },
];
