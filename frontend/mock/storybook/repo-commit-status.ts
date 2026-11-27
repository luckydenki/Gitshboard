import type {
    RepoCommitStatusOverviewDto,
    RepoCommitStatusRecordsDto,
} from "../../app/types/response/repo-commit-status";

const period = {
    from: "2025-11-19T00:00:00Z",
    to: "2026-11-19T00:00:00Z",
    effectiveTo: "2026-11-19T00:00:00Z",
};
const previousPeriod = { from: "2024-11-19T00:00:00Z", to: period.from, effectiveTo: period.from };
const weeks = Array.from({ length: 52 }, (_, index) => ({
    from: new Date(Date.parse("2025-11-17T00:00:00Z") + index * 604_800_000).toISOString(),
    to: new Date(Date.parse("2025-11-24T00:00:00Z") + index * 604_800_000).toISOString(),
    count: index % 5 === 0 ? 0 : index + 3,
}));
const totalCommits = weeks.reduce((total, week) => total + week.count, 0);
const additions = totalCommits * 4;
const deletions = totalCommits * 2;

/** Storybook의 정상 커밋 현황 응답입니다. */
export const commitOverview: RepoCommitStatusOverviewDto = {
    asOf: "2026-11-19T09:00:00Z",
    timezone: "UTC",
    branch: "main",
    headSha: "abc123",
    basis: { scope: "default_branch_history", includeMerges: true },
    rollingYear: period,
    weekly: { status: "complete", value: { period, points: weeks } },
    yearly: {
        status: "complete",
        value: {
            period,
            count: totalCommits,
            previousPeriod,
            previousCount: 1000,
            changePercent: (totalCommits - 1000) / 10,
        },
    },
    periods: {
        status: "complete",
        value: [7, 30, 90].map((days) => ({
            days: days as 7 | 30 | 90,
            period,
            count: days * 3,
            previousPeriod,
            previousCount: days * 2,
            changePercent: 50,
        })),
    },
    codeChange: {
        status: "complete",
        value: {
            period,
            granularity: "week",
            points: weeks.map((week) => ({
                ...week,
                additions: week.count * 4,
                deletions: week.count * 2,
                net: week.count * 2,
            })),
            additions,
            deletions,
            net: additions - deletions,
            additionsPercent: 66.7,
            deletionsPercent: 33.3,
        },
    },
    timeOfDay: {
        status: "complete",
        value: {
            period,
            buckets: [0, 4, 8, 12, 16, 20].map((startHour) => ({
                startHour: startHour as 0 | 4 | 8 | 12 | 16 | 20,
                count: startHour * 2 + 3,
            })),
            peakStartHour: 20,
            middayPercent: 38,
        },
    },
};

/** Storybook의 정상 커밋 전적 응답입니다. */
export const commitRecords: RepoCommitStatusRecordsDto = {
    asOf: commitOverview.asOf,
    timezone: "UTC",
    scope: "rolling_year",
    period,
    branch: "main",
    headSha: "abc123",
    totalCommits: { status: "complete", value: totalCommits },
    activeDays: { status: "complete", value: { count: 205, totalDays: 365, percentage: 56.2 } },
    activeWeeks: { status: "complete", value: 45 },
    avgCommitsPerActiveWeek: { status: "complete", value: 28.7 },
    avgCommitsPerActiveDay: { status: "complete", value: 6.3 },
    busiestWeek: { status: "complete", value: weeks[51] },
    lastCommit: {
        status: "complete",
        value: { sha: "abc123", committedAt: "2026-11-18T14:30:00Z" },
    },
    longestInactiveDays: {
        status: "complete",
        value: { days: 7, from: "2026-04-01", to: "2026-04-08" },
    },
    longestActiveWeeks: { status: "complete", value: { weeks: 12, ongoing: true } },
};
