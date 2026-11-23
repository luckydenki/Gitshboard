/** Communication 집계 응답: complete만 실제 값을 가지며 나머지는 null이다. */
export type CommunicationMetric<T> = {
    status: "complete" | "partial" | "unavailable";
    value: T | null;
    reason?: string;
};
export interface CommunicationContributor {
    login: string;
    avatarUrl: string;
    url: string;
    commits: number;
    sharePercent: number | null;
}
export interface CommunicationDiscussion {
    number: number;
    title: string;
    url: string;
    categoryName: string;
    topLevelCommentCount: number;
    upvoteCount: number;
    recentActivity: number;
    uniqueCommenterCount: number;
    score: number;
    elapsedDays: number;
}
export interface GetRepoCommunicationData {
    asOf: string;
    contributors?: CommunicationMetric<{ totalEntries: number; top: CommunicationContributor[] }>;
    openIssues?: CommunicationMetric<{
        total: number;
        goodFirstIssueCount: number;
        helpWantedCount: number;
        assignedPercent: number | null;
    }>;
    distribution?: CommunicationMetric<{
        total: number;
        categories: { id: string; name: string; count: number; percent: number | null }[];
    }>;
    responses?: CommunicationMetric<{
        answerableCount: number;
        answeredCount: number;
        answeredPercent: number | null;
    }>;
    popular?: CommunicationMetric<CommunicationDiscussion[]>;
    releases?: CommunicationMetric<{
        count: number;
        monthlyAverage: number;
        months: 6;
        includePrereleases: true;
        period: { from: string; to: string };
    }>;
}
