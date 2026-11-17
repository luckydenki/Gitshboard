export interface RepoProjectOverviewDto {
    languages: Array<{ name: string; bytes: number; sharePercent: number | null }>;
    totalLanguageBytes: number; // (derived)
    diskUsageKb: number | null;
    issuePrCounts: {
        openIssues: number;
        closedIssues: number;
        openPullRequests: number;
        mergedPullRequests: number;
    };
}

export interface RepoProjectFilesDto {
    fileCount: number | null;
    fileTypes: Array<{ type: "source" | "test" | "docs" | "config"; count: number; sharePercent: number | null }>;
    frameworks: Array<{ name: string; paths: string[] }>;
    healthScore: { present: number; total: number }; // (derived)
    health: Array<{ name: string; present: boolean }>;
    partial: boolean;
}

export interface RepoProjectBranchesDto {
    defaultBranch: string | null;
    total: number;
    active: number;
    stale: number;
    oldest: Array<{ name: string; committedAt: string }>;
    partial: boolean;
}

export interface RepoProjectHistoryDto {
    months: Array<{ month: string; fileCount: number | null; diskUsageKb: number | null }>;
    coverage: { missingFileCountMonths: string[]; unobservedDiskUsageMonths: string[] }; // (derived)
    partial: boolean;
}

export interface RepoProjectParticipationDto {
    months: Array<{
        month: string;
        issueAuthors: number | null;
        prAuthors: number | null;
        contributors: number | null;
    }>;
    latestContributorCount: number | null; // (derived)
    latestContributorMonth: string | null; // (derived)
    partial: boolean;
}

export interface RepoProjectDeploymentsDto {
    attempts: number;
    successful: number;
    completed: number;
    successRatePercent: number | null; // (derived)
    attemptsPerWeek: number; // (derived)
    medianDurationSeconds: number | null;
    medianLeadTimeSeconds: number | null;
    peakHour: number | null;
    hourBuckets: Array<{ hour: number; count: number }>;
    partial: boolean;
}
