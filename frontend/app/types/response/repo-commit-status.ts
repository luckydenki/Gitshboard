/** 기본 브랜치 커밋 현황 API의 기간과 수집 상태입니다. */
export type CommitStatusPeriod = { from: string; to: string; effectiveTo: string };
export type CommitStatusMetric<T> = {
    status: "complete" | "partial" | "unavailable";
    value: T | null;
    reason?: string;
};
export type CommitStatusWeek = { from: string; to: string; count: number };
export type CommitStatusCodeWeek = CommitStatusWeek & { additions: number; deletions: number; net: number };

/** 커밋 현황 개요 응답입니다. */
export interface RepoCommitStatusOverviewDto {
    asOf: string;
    timezone: string;
    branch: string | null;
    headSha: string | null;
    basis: { scope: "default_branch_history"; includeMerges: true };
    rollingYear: CommitStatusPeriod;
    weekly: CommitStatusMetric<{ period: CommitStatusPeriod; points: CommitStatusWeek[] }>;
    yearly: CommitStatusMetric<{
        period: CommitStatusPeriod; count: number; previousPeriod: CommitStatusPeriod;
        previousCount: number; changePercent: number | null;
    }>;
    periods: CommitStatusMetric<{
        days: 7 | 30 | 90; period: CommitStatusPeriod; count: number;
        previousPeriod: CommitStatusPeriod; previousCount: number; changePercent: number | null;
    }[]>;
    codeChange: CommitStatusMetric<{
        period: CommitStatusPeriod; granularity: "week"; points: CommitStatusCodeWeek[];
        additions: number; deletions: number; net: number;
        additionsPercent: number | null; deletionsPercent: number | null;
    }>;
    timeOfDay: CommitStatusMetric<{
        period: CommitStatusPeriod;
        buckets: { startHour: 0 | 4 | 8 | 12 | 16 | 20; count: number }[];
        peakStartHour: number | null; middayPercent: number | null;
    }>;
}

/** 커밋 전적 응답입니다. */
export interface RepoCommitStatusRecordsDto {
    asOf: string; timezone: string; scope: "rolling_year" | "all";
    period: CommitStatusPeriod | null; branch: string | null; headSha: string | null;
    totalCommits: CommitStatusMetric<number>;
    activeDays: CommitStatusMetric<{ count: number; totalDays: number; percentage: number | null }>;
    activeWeeks: CommitStatusMetric<number>;
    avgCommitsPerActiveWeek: CommitStatusMetric<number>;
    avgCommitsPerActiveDay: CommitStatusMetric<number>;
    busiestWeek: CommitStatusMetric<CommitStatusWeek | null>;
    lastCommit: CommitStatusMetric<{ sha: string; committedAt: string } | null>;
    longestInactiveDays: CommitStatusMetric<{ days: number; from: string; to: string } | null>;
    longestActiveWeeks: CommitStatusMetric<{ weeks: number; ongoing: boolean }>;
}
