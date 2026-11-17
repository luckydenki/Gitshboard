import type { RepoActivityCounts, RepoActivityEvent } from "../types/controllers/repo";

/** 보류된 현재 상태·활동 리듬 계산입니다. 활성 API에서 사용하지 않습니다. */
export function calculateRepoActivityStatus({
    events, counts, days, clock, dailyCommits, sampledResponseTimes,
    issueResponseSamplePartial, truncatedSources,
}: {
    events: RepoActivityEvent[];
    counts: RepoActivityCounts;
    days: Array<{ date: string; total: number }>;
    clock: Intl.DateTimeFormat;
    dailyCommits: Array<{ date: string; count: number }>;
    sampledResponseTimes: number[];
    issueResponseSamplePartial: boolean;
    truncatedSources: Array<keyof RepoActivityCounts>;
}) {
    const hours = Array.from({ length: 6 }, (_, index) => ({
        fromHour: index * 4, toHour: (index + 1) * 4, count: 0,
    }));
    for (const event of events.values()) {
        const hour = clock.formatToParts(new Date(event.occurredAt)).find((part) => part.type === "hour");
        if (hour) hours[Math.floor(Number(hour.value) / 4)].count++;
    }

    const total = events.length;
    const peakHours = total ? hours.reduce((peak, hour) => hour.count > peak.count ? hour : peak) : null;
    const weekdayTotal = days.reduce((sum, day) => {
        const weekday = new Date(day.date).getUTCDay();
        return weekday >= 1 && weekday <= 5 ? sum + day.total : sum;
    }, 0);
    const activeCommitDays = dailyCommits.filter(({ count }) => count > 0).length;
    const responseTimes = [...sampledResponseTimes];
    responseTimes.sort((a, b) => a - b);
    const middle = Math.floor(responseTimes.length / 2);
    const firstResponseMedianSeconds = responseTimes.length === 0 ? null
        : responseTimes.length % 2 ? responseTimes[middle]
            : (responseTimes[middle - 1] + responseTimes[middle]) / 2;
    const badges: Array<"active-project" | "steady-commits" | "fast-issue-response"> = [];
    if (Object.values(counts).every((count) => count > 0)) badges.push("active-project");
    if (activeCommitDays >= 5) badges.push("steady-commits");
    if (!issueResponseSamplePartial && !truncatedSources.includes("issue") && responseTimes.length >= 3 &&
        firstResponseMedianSeconds !== null && firstResponseMedianSeconds <= 24 * 60 * 60) {
        badges.push("fast-issue-response");
    }
    return {
        peakHours, weekdayShare: total ? weekdayTotal / total : null,
        activeCommitDays, firstResponseMedianSeconds, badges,
    };
}

/** 보류된 이슈 첫 응답 샘플링에 필요한 GitHub GraphQL 필드입니다. */
export const issueResponseFields = `
    comments(first: 10) {
        pageInfo { hasNextPage }
        nodes { createdAt author { login __typename } }
    }
`;

/** 이슈 작성자와 봇을 제외한 첫 답변까지의 시간을 구합니다. */
export function sampleFirstIssueResponse(
    issue: {
        createdAt: string;
        author?: { login: string } | null;
        comments: {
            nodes?: Array<{ createdAt: string; author?: { login: string; __typename: string } | null } | null> | null;
            pageInfo: { hasNextPage: boolean };
        };
    },
    asOf: string,
) {
    const reply = issue.comments.nodes?.find((comment) =>
        comment?.author && comment.author.__typename !== "Bot" &&
        comment.author.login !== issue.author?.login &&
        Date.parse(comment.createdAt) < Date.parse(asOf),
    );
    return {
        seconds: reply ? (Date.parse(reply.createdAt) - Date.parse(issue.createdAt)) / 1000 : null,
        partial: !reply && issue.comments.pageInfo.hasNextPage,
    };
}
