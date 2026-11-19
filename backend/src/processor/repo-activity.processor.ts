import type { GetRepoActivityData, RepoActivityCounts, RepoActivityEvent } from "../types/controllers/repo";
import type { GithubGQLGetRepoActivityQuery, GithubGQLGetRepoActivityQueryVariables } from "../types/github/graphql/operations.generated";

type ActivityRepository = NonNullable<GithubGQLGetRepoActivityQuery["repository"]>;
type ActivityTarget = NonNullable<NonNullable<ActivityRepository["defaultBranchRef"]>["target"]>;
type ActivityCommits = Extract<ActivityTarget, { history: unknown }>["history"];

class RepoActivityProcessor {
    /**
     * 스냅샷 기준 최근 7개 현지 날짜와 조회 시작 시각을 계산합니다.
     * @param asOf 활동 스냅샷의 ISO 시각.
     * @param clock 조회 시간대의 날짜 포매터.
     * @returns 날짜 목록, 조회 시작 시각, 날짜 변환 및 범위 판별 함수.
     */
    public static getWindow(asOf: string, clock: Intl.DateTimeFormat) {
        const dateKey = (value: string) => {
            const parts = clock.formatToParts(new Date(value));
            const year = parts.find((part) => part.type === "year")?.value;
            const month = parts.find((part) => part.type === "month")?.value;
            const day = parts.find((part) => part.type === "day")?.value;
            return `${year}-${month}-${day}`;
        };
        const dayMs = 24 * 60 * 60 * 1000;
        const lastDate = dateKey(asOf);
        const lastDateMidnight = Date.parse(lastDate);
        const dates = Array.from({ length: 7 }, (_, index) =>
            new Date(lastDateMidnight - (6 - index) * dayMs).toISOString().slice(0, 10),
        );
        const since = new Date(lastDateMidnight - 7 * dayMs).toISOString();
        const inWindow = (value: string) =>
            Date.parse(value) < Date.parse(asOf) && dateKey(value) >= dates[0];
        return { dates, lastDate, since, dateKey, inWindow };
    }

    /**
     * 이벤트를 조회 범위로 걸러 ID 기준으로 중복 제거합니다.
     * @param current 이전 페이지까지 누적한 이벤트.
     * @param incoming 현재 페이지에서 변환한 이벤트.
     * @param includeEvent 이벤트 포함 여부를 판단하는 함수.
     * @returns 새 이벤트가 반영된 Map.
     */
    public static collectEvents(
        current: ReadonlyMap<string, RepoActivityEvent>,
        incoming: readonly RepoActivityEvent[],
        includeEvent: (value: string) => boolean,
    ): Map<string, RepoActivityEvent> {
        const events = new Map(current);
        for (const event of incoming) {
            if (includeEvent(event.occurredAt)) events.set(event.id, event);
        }
        return events;
    }

    /**
     * 현재 페이지와 누적 이벤트를 이용해 다음 조회 변수를 계산합니다.
     * @param variables 현재 페이지의 조회 변수.
     * @param repository GitHub 저장소 응답.
     * @param commits 선택한 브랜치의 커밋 기록.
     * @param events 누적된 중복 제거 이벤트.
     * @param isSummary 요약 조회 여부.
     * @param since 요약 조회의 시작 시각.
     * @param limit 최근 활동의 최대 개수.
     * @returns 다음 페이지에서 사용할 조회 변수.
     */
    public static nextPageVariables(
        variables: GithubGQLGetRepoActivityQueryVariables,
        repository: ActivityRepository,
        commits: ActivityCommits | undefined,
        events: ReadonlyMap<string, RepoActivityEvent>,
        isSummary: boolean,
        since: string,
        limit: number,
    ): GithubGQLGetRepoActivityQueryVariables {
        const { pullRequests, issues } = repository;
        const commitAfter = commits?.pageInfo.endCursor;
        const pullRequestAfter = pullRequests?.pageInfo.endCursor;
        const issueAfter = issues?.pageInfo.endCursor;
        const hasMoreCommits = isSummary && Boolean(commits?.pageInfo.hasNextPage && commitAfter);
        // PR과 이슈는 updatedAt 순서이므로 cutoff 이전 항목이 나오면 조회를 멈춥니다.
        let cutoffTime = isSummary ? Date.parse(since) : Number.NEGATIVE_INFINITY;
        if (!isSummary && events.size >= limit) {
            const eventDates = [...events.values()].map(({ occurredAt }) => occurredAt).sort();
            cutoffTime = Date.parse(eventDates[eventDates.length - limit]);
        }
        return {
            ...variables,
            commitAfter, pullRequestAfter, issueAfter,
            readDefaultBranch: variables.readDefaultBranch && hasMoreCommits,
            readSelectedBranch: variables.readSelectedBranch && hasMoreCommits,
            readPullRequests: Boolean(pullRequests?.pageInfo.hasNextPage && pullRequestAfter &&
                !pullRequests.nodes?.some((pr) => pr && Date.parse(pr.updatedAt) < cutoffTime)),
            readIssues: Boolean(issues?.pageInfo.hasNextPage && issueAfter &&
                !issues.nodes?.some((issue) => issue && Date.parse(issue.updatedAt) < cutoffTime)),
        };
    }

    /**
     * 누적 활동을 정렬·제한하고 유형별 건수를 계산합니다.
     * @param events ID 기준으로 중복 제거된 이벤트.
     * @param isSummary 요약 조회 여부.
     * @param limit 최근 활동의 최대 개수.
     * @returns 정리된 이벤트 목록과 유형별 건수.
     */
    public static summarize(events: ReadonlyMap<string, RepoActivityEvent>, isSummary: boolean, limit: number) {
        const orderedEvents = [...events.values()];
        if (!isSummary) {
            orderedEvents.sort((a, b) =>
                b.occurredAt.localeCompare(a.occurredAt) || a.id.localeCompare(b.id),
            );
            orderedEvents.length = Math.min(orderedEvents.length, limit);
        }
        const counts: RepoActivityCounts = { commit: 0, "pull-request": 0, issue: 0 };
        for (const event of orderedEvents) counts[event.type]++;
        return { orderedEvents, counts };
    }

    /**
     * 페이지 제한으로 끝까지 읽지 못한 활동 종류를 계산합니다.
     * @param variables 마지막 조회 이후의 다음 페이지 변수.
     * @returns 추가 조회가 필요한 활동 종류.
     */
    public static truncatedSources(variables: GithubGQLGetRepoActivityQueryVariables): GetRepoActivityData["coverage"]["truncatedSources"] {
        const sources: GetRepoActivityData["coverage"]["truncatedSources"] = [];
        if (variables.readDefaultBranch || variables.readSelectedBranch) sources.push("commit");
        if (variables.readPullRequests) sources.push("pull-request");
        if (variables.readIssues) sources.push("issue");
        return sources;
    }

    /**
     * 활동 이벤트를 현지 날짜별로 집계합니다.
     * @param events 집계할 활동 이벤트.
     * @param dates 집계 대상 날짜 목록.
     * @param dateKey 이벤트 시각을 현지 날짜로 변환하는 함수.
     * @returns 일별 커밋 건수와 최고 활동일.
     */
    public static summarizeByDay(events: readonly RepoActivityEvent[], dates: readonly string[], dateKey: (value: string) => string) {
        const days = dates.map((date) => ({ date, total: 0, counts: { commit: 0, "pull-request": 0, issue: 0 } }));
        for (const event of events) {
            const day = days.find(({ date }) => date === dateKey(event.occurredAt));
            if (!day) continue;
            day.total++;
            day.counts[event.type]++;
        }
        return {
            dailyCommits: days.map(({ date, counts }) => ({ date, count: counts.commit })),
            peakDay: events.length ? days.reduce((peak, day) => day.total > peak.total ? day : peak) : null,
        };
    }
}

export default RepoActivityProcessor;
