/** PR·Issue 화면에 표시할 계산값과 수집 상태입니다. */
export type Metric<T> =
    | { status: "complete"; value: T }
    | { status: "partial" | "unavailable"; value: null; reason: string };

export type Period = { from: string; to: string };
export type Distribution = { label: string; count: number; percent: number | null }[];
export type Duration = { samples: number; medianSeconds: number | null; p90Seconds: number | null };
export type DashboardPeriod = { asOf: string; timezone: string; period: Period };
export type IssueFlow = {
    weeks: (Period & { opened: number; closed: number })[];
    opened: number;
    closed: number;
    closeToOpenPercent: number | null;
    net: number;
};

export type IssueStats = {
    totals: { open: number; closed: number; total: number };
    flow: IssueFlow;
    openAge: Distribution;
    labels: Distribution;
    participation: { unassigned: number; goodFirstIssue: number };
    commentDistribution: Distribution;
    closeDuration: Duration;
    closeDurationByType: { type: string | null; duration: Duration }[];
    closeReasons: Distribution;
};

export type GetRepoIssueStatsData = DashboardPeriod & {
    stats: Metric<IssueStats>;
    milestones: Metric<
        { number: number; title: string; open: number; closed: number; percent: number | null }[]
    >;
};

export type PullRequestTotals = { open: number; merged: number; closedUnmerged: number };
export type PullRequestOverview = {
    outcomes: { merged: number; closedUnmerged: number; mergedPercent: number | null };
    mergeTime: Duration;
    bots: { count: number; unknown: number; total: number; percent: number | null };
};
export type PullRequestSizeStats = {
    sizes: Distribution;
    meanChangedFiles: number | null;
    mergeTimeBySize: { size: string; duration: Duration }[];
};
export type Collaboration = {
    samples: number;
    meanReviews: number | null;
    meanComments: number | null;
    meanParticipants: number | null;
};
export type GetRepoPullRequestStatsData = DashboardPeriod & {
    totals: Metric<PullRequestTotals>;
    draft: Metric<{ count: number; total: number; percent: number | null }>;
    overview: Metric<PullRequestOverview>;
    firstReview: Metric<Duration>;
    sizeStats: Metric<PullRequestSizeStats>;
    collaboration: Metric<Collaboration>;
    linkedIssues: Metric<{ linkedPrs: number; totalPrs: number; referencedIssues: number }>;
};
