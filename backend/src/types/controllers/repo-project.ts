/** 저장소 프로젝트 현황의 현재 개요입니다. */
export interface GetRepoProjectOverviewData {
    languages: { name: string; bytes: number; sharePercent: number | null }[];
    totalLanguageBytes: number; // (derived)
    diskUsageKb: number | null;
    issuePrCounts: { openIssues: number; closedIssues: number; openPullRequests: number; mergedPullRequests: number };
}

/** 기본 브랜치 파일과 커뮤니티 문서 현황입니다. */
export interface GetRepoProjectFilesData {
    fileCount: number | null;
    fileTypes: { type: "source" | "test" | "docs" | "config"; count: number; sharePercent: number | null }[];
    frameworks: { name: string; paths: string[] }[];
    healthScore: { present: number; total: number }; // (derived)
    health: { name: string; present: boolean }[];
    partial: boolean;
}

/** 브랜치의 최신 커밋 시각에 따른 현황입니다. */
export interface GetRepoProjectBranchesData {
    defaultBranch: string | null;
    total: number;
    active: number;
    stale: number;
    oldest: { name: string; committedAt: string }[];
    partial: boolean;
}

/** 최근 월별 파일 및 관측 용량 기록입니다. */
export interface GetRepoProjectHistoryData {
    months: { month: string; fileCount: number | null; diskUsageKb: number | null }[];
    coverage: { missingFileCountMonths: string[]; unobservedDiskUsageMonths: string[] }; // (derived)
    partial: boolean;
}

/** 월별 이슈·PR 작성자와 누적 커밋 기여자 현황입니다. */
export interface GetRepoProjectParticipationData {
    months: { month: string; issueAuthors: number | null; prAuthors: number | null; contributors: number | null }[];
    latestContributorCount: number | null; // (derived)
    latestContributorMonth: string | null; // (derived)
    partial: boolean;
}

/** 최근 90일 production 배포 현황입니다. */
export interface GetRepoProjectDeploymentsData {
    attempts: number;
    successful: number;
    completed: number;
    successRatePercent: number | null; // (derived)
    attemptsPerWeek: number; // (derived)
    medianDurationSeconds: number | null;
    medianLeadTimeSeconds: number | null;
    peakHour: number | null;
    hourBuckets: { hour: number; count: number }[];
    partial: boolean;
}
