import type { GetRepoActivityDto, RepoActivityCounts } from "./repo-activity";

export interface GetRepoActivitySummaryDto extends Pick<GetRepoActivityDto, "asOf" | "window" | "counts"> {
    dailyCommits: Array<{ date: string; count: number }>; // (derived)
    peakDay: { date: string; total: number; counts: RepoActivityCounts } | null; // (derived)
    peakHours: { fromHour: number; toHour: number; count: number } | null; // (derived)
    weekdayShare: number | null; // (derived)
    activeCommitDays: number; // (derived)
    firstResponseMedianSeconds: number | null; // (derived)
    badges: Array<"active-project" | "steady-commits" | "fast-issue-response">; // (derived)
    coverage: {
        truncatedSources: GetRepoActivityDto["coverage"]["truncatedSources"];
        issueResponseSamplePartial: boolean;
    }; // (derived)
}
