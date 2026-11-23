import RepoCommitStatusProcessor from "../processor/repo-commit-status.processor";
import type {
    DashboardPeriod,
    Distribution,
    Duration,
    IssueStats,
    PullRequestSizeStats,
} from "../types/controllers/repo-pr-issue";
import type { RestIssue, RestPullDetail } from "../types/github/rest/repo-pr-issue";

const day = 86400000;
const sizeLabels = ["100줄 이하", "101~500줄", "501~1,000줄", "1,000줄 초과"];

/** percent — 분자와 분모를 비율로 변환합니다. 예: percent(1, 2) = 50, percent(0, 0) = null. 테스트: src/test/repo-pr-issue.test.ts */
export function percent(count: number, total: number): number | null {
    return total ? (count / total) * 100 : null;
}

/** summarizeDuration — 초 단위 표본의 중앙값과 P90을 반환합니다. 예: []는 표본 0과 null을 반환합니다. 테스트: src/test/repo-pr-issue.test.ts */
export function summarizeDuration(seconds: readonly number[]): Duration {
    const sorted = [...seconds].sort((a, b) => a - b);
    const samples = sorted.length;
    return {
        samples,
        medianSeconds: samples
            ? (sorted[Math.floor((samples - 1) / 2)] + sorted[Math.floor(samples / 2)]) / 2
            : null,
        p90Seconds: samples ? sorted[Math.ceil(samples * 0.9) - 1] : null,
    };
}

function distribution(counts: ReadonlyMap<string, number>, total: number): Distribution {
    return [...counts].map(([label, count]) => ({ label, count, percent: percent(count, total) }));
}

export type IssueInput = Pick<
    RestIssue,
    "state" | "created_at" | "closed_at" | "labels" | "comments"
> & {
    type?: { name: string } | null;
    assignees?: unknown[] | null;
    assignee?: unknown;
    state_reason?: string | null;
    pull_request?: unknown;
};
const stateReasons = new Map([
    ["completed", "완료"],
    ["not_planned", "계획 없음"],
    ["duplicate", "중복"],
]);

/** issueStats — REST 이슈 목록과 조회 기간으로 Issue 전용 집계를 생성합니다. PR은 제외됩니다. 예: 빈 목록은 총 0건입니다. 테스트: src/test/repo-pr-issue.test.ts */
export function issueStats(
    items: readonly IssueInput[],
    { asOf, period, timezone }: DashboardPeriod,
): IssueStats {
    const issues = items.filter((issue) => !issue.pull_request);
    const open = issues.filter((issue) => issue.state === "open");
    const closed = issues.filter((issue) => issue.state === "closed");
    const endDate = RepoCommitStatusProcessor.localParts(period.to, timezone).date;
    const weeks = [28, 21, 14, 7].map((days) => ({
        from: RepoCommitStatusProcessor.midnight(
            RepoCommitStatusProcessor.moveDate(endDate, -days),
            timezone,
        ),
        to: RepoCommitStatusProcessor.midnight(
            RepoCommitStatusProcessor.moveDate(endDate, 7 - days),
            timezone,
        ),
        opened: 0,
        closed: 0,
    }));
    const age = new Map(["7일 이하", "8~30일", "31~90일", "90일 초과"].map((label) => [label, 0]));
    const comments = new Map(["0개", "1~3개", "4~9개", "10개 이상"].map((label) => [label, 0]));
    const labels = new Map<string, number>();
    const reasons = new Map<string, number>();
    const durations = new Map<string | null, number[]>();
    let unassigned = 0;
    let goodFirstIssue = 0;

    for (const issue of open) {
        const days = (Date.parse(asOf) - Date.parse(issue.created_at)) / day;
        const ageLabel =
            days <= 7 ? "7일 이하" : days <= 30 ? "8~30일" : days <= 90 ? "31~90일" : "90일 초과";
        age.set(ageLabel, age.get(ageLabel)! + 1);
        const commentLabel =
            issue.comments === 0
                ? "0개"
                : issue.comments <= 3
                  ? "1~3개"
                  : issue.comments <= 9
                    ? "4~9개"
                    : "10개 이상";
        comments.set(commentLabel, comments.get(commentLabel)! + 1);
        const names = new Set(
            issue.labels
                .map((label) => (typeof label === "string" ? label : label.name))
                .filter((name): name is string => !!name),
        );
        for (const name of names) labels.set(name, (labels.get(name) ?? 0) + 1);
        if ([...names].some((name) => name.toLowerCase() === "good first issue")) goodFirstIssue++;
        if (!(issue.assignees?.length ?? (issue.assignee ? 1 : 0))) unassigned++;
    }
    for (const issue of issues) {
        const created = Date.parse(issue.created_at);
        const closedAt =
            issue.state === "closed" && issue.closed_at ? Date.parse(issue.closed_at) : NaN;
        const createdWeek = weeks.find(
            (week) => created >= Date.parse(week.from) && created < Date.parse(week.to),
        );
        if (createdWeek) createdWeek.opened++;
        const closedWeek = weeks.find(
            (week) => closedAt >= Date.parse(week.from) && closedAt < Date.parse(week.to),
        );
        if (closedWeek) {
            closedWeek.closed++;
            const type = issue.type?.name ?? null;
            const seconds = durations.get(type) ?? [];
            seconds.push((closedAt - created) / 1000);
            durations.set(type, seconds);
        }
        if (issue.state === "closed") {
            const reason = stateReasons.get(issue.state_reason ?? "") ?? "미지정";
            reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
        }
    }
    const opened = weeks.reduce((sum, week) => sum + week.opened, 0);
    const ended = weeks.reduce((sum, week) => sum + week.closed, 0);
    return {
        totals: { open: open.length, closed: closed.length, total: issues.length },
        flow: {
            weeks,
            opened,
            closed: ended,
            closeToOpenPercent: percent(ended, opened),
            net: opened - ended,
        },
        openAge: distribution(age, open.length),
        labels: distribution(
            new Map(
                [...labels].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10),
            ),
            open.length,
        ),
        participation: { unassigned, goodFirstIssue },
        commentDistribution: distribution(comments, open.length),
        closeDuration: summarizeDuration([...durations.values()].flat()),
        closeDurationByType: [...durations]
            .map(([type, seconds]) => ({ type, duration: summarizeDuration(seconds) }))
            .sort(
                (a, b) =>
                    b.duration.samples - a.duration.samples ||
                    (a.type ?? "").localeCompare(b.type ?? ""),
            ),
        closeReasons: distribution(reasons, closed.length).sort(
            (a, b) => b.count - a.count || a.label.localeCompare(b.label),
        ),
    };
}

type Author = { id: number; type?: string | null } | null | undefined;
type Comment = { user?: Author };
type Review = Comment & { submitted_at?: string | null; state: string };

/** reviewActivity — PR 작성자, 제출 리뷰와 두 댓글 목록을 받아 봇 제외 집계와 첫 리뷰 시각을 반환합니다. 작성자가 없으면 누락 상태로 표시합니다. 테스트: src/test/repo-pr-issue.test.ts */
export function reviewActivity(
    author: Author,
    reviews: readonly Review[],
    conversation: readonly Comment[],
    codeComments: readonly Comment[],
) {
    const submitted = reviews.filter((review) => review.state !== "PENDING" && review.submitted_at);
    const comments = [...conversation, ...codeComments];
    const authors = [
        author,
        ...submitted.map((review) => review.user),
        ...comments.map((comment) => comment.user),
    ];
    const missingAuthors = authors.some((person) => !person?.type);
    const participants = new Set(
        authors
            .filter((person) => person?.type && person.type !== "Bot")
            .map((person) => person!.id),
    );
    const humanReviews = submitted.filter(
        (review) => review.user?.type && review.user.type !== "Bot",
    );
    return {
        reviews: humanReviews.length,
        comments: comments.filter((comment) => comment.user?.type && comment.user.type !== "Bot")
            .length,
        participants: participants.size,
        missingAuthors,
        firstReviewAt: humanReviews.map((review) => review.submitted_at!).sort()[0] ?? null,
    };
}

/** pullRequestSizes — PR 상세의 변경 줄 수·파일 수와 병합 시간을 크기별로 집계합니다. 빈 목록의 평균은 null입니다. 테스트: src/test/repo-pr-issue.test.ts */
export function pullRequestSizes(pulls: readonly RestPullDetail[]): PullRequestSizeStats {
    const counts = new Map(sizeLabels.map((label) => [label, 0]));
    const mergedTimes = new Map<string, number[]>();
    let files = 0;
    for (const pull of pulls) {
        const lines = pull.additions + pull.deletions;
        const size = sizeLabels[lines <= 100 ? 0 : lines <= 500 ? 1 : lines <= 1000 ? 2 : 3];
        counts.set(size, counts.get(size)! + 1);
        files += pull.changed_files;
        if (pull.merged_at) {
            const times = mergedTimes.get(size) ?? [];
            times.push((Date.parse(pull.merged_at) - Date.parse(pull.created_at)) / 1000);
            mergedTimes.set(size, times);
        }
    }
    return {
        sizes: distribution(counts, pulls.length),
        meanChangedFiles: pulls.length ? files / pulls.length : null,
        mergeTimeBySize: sizeLabels.map((size) => ({
            size,
            duration: summarizeDuration(mergedTimes.get(size) ?? []),
        })),
    };
}
