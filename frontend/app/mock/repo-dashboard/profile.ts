export const topicsMock = ["react", "javascript", "library", "frontend", "ui"] as const;

export const profileStatsMock = [
    { label: "Stars", value: "241k", icon: "FiStar" },
    { label: "Forks", value: "49.7k", icon: "PiGitFork" },
    { label: "Watchers", value: "6.8k", icon: "FiEye" },
    { label: "기여자", value: "1,842", icon: "FiUsers" },
    { label: "열린 이슈", value: "842", icon: "FiGitCommit" },
] as const;

export const summaryMock = {
    lastPush: "마지막 푸시 2시간 전",
};

export const profileMock = {
    avatarUrl: "https://github.com/facebook.png?size=160",
    avatarAlt: "Meta 조직 프로필",
    githubUrl: "https://github.com/facebook/react",
    owner: "facebook",
    visibility: "Public",
    name: "react",
    license: "MIT License",
    defaultBranch: "main",
    description: "사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.",
};
