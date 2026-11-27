import githubRepoCommitStatusClient from "../client/repo-commit-status.client";
import RepoCommitStatusProcessor, {
    type CommitStatusCommit,
} from "../processor/repo-commit-status.processor";
import { RepoSnapshot, SnapshotCursorFirst, SnapshotNormal } from "../temp/RepoSnapshotFetch";
import type {
    CommitStatusMetric,
    CommitStatusPeriod,
    GetRepoCommitStatusOverviewData,
    GetRepoCommitStatusRecordsData,
} from "../types/controllers/repo-commit-status";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";

const MAX_PAGES = 50;
type Request = {
    owner: unknown;
    repo: unknown;
    timezone?: unknown;
    scope?: unknown;
    token?: string;
};
export type Snapshot = {
    asOf: string;
    timezone: string;
    today: string;
    branch: string | null;
    headSha: string | null;
    commits: CommitStatusCommit[];
    complete: boolean;
};

/** 기본 브랜치의 커밋 현황을 API 응답 데이터로 집계합니다. */
class RepoCommitStatusServices {
    private parse(input: Request) {
        const timezone = input.timezone === undefined ? "Asia/Seoul" : input.timezone;
        const location = RepoUtils.parseActivityLocation(input.owner, input.repo, timezone);
        if (!location)
            throw CommonError.create400Error("저장소 주소 또는 시간대가 잘못되었습니다.");
        try {
            new Intl.DateTimeFormat("en-US", { timeZone: location.timezone });
        } catch {
            throw CommonError.create400Error("유효한 IANA 시간대를 입력해 주세요.");
        }
        return location;
    }

    private metric<T>(value: T, complete: boolean): CommitStatusMetric<T> {
        return complete
            ? { status: "complete", value }
            : {
                  status: "partial",
                  value: null,
                  reason: "GitHub 커밋 이력이 페이지 한도를 넘어 집계가 완료되지 않았습니다.",
              };
    }

    private async snapshot(
        input: Request,
        since: string | undefined,
        until: string,
        asOf: string,
        today: string,
        timezone: string,
        log: string,
    ): Promise<Snapshot> {
        const location = this.parse(input);
        const commits: CommitStatusCommit[] = [];
        let after: string | null = null;
        let branch: string | null = null;
        let headSha: string | null = null;
        let complete = false;
        let missingNode = false;

        const start = performance.now();

        const params = {
            owner: location.owner,
            name: location.repo,
            asOf,
            until,
            since,
            timezone,
            today,
        };

        //TODO : N+1 문제 해결 필요
        const result = await SnapshotNormal(input.token, MAX_PAGES, params);

        //const result = await SnapshotCursorFirst(input.token, MAX_PAGES, params);

        console.log(`${log} execution time :`, performance.now() - start);

        return result;
    }

    /** 최근 완료된 1년의 그래프와 기간 비교를 반환합니다. */
    public async getOverview(input: Request): Promise<GetRepoCommitStatusOverviewData> {
        const { timezone } = this.parse(input);
        const asOf = new Date().toISOString();
        const today = RepoCommitStatusProcessor.localParts(asOf, timezone).date;
        const rollingYear = RepoCommitStatusProcessor.yearPeriod(today, timezone);
        const yearStartDate = RepoCommitStatusProcessor.localParts(rollingYear.from, timezone).date;
        const previousStartDate = RepoCommitStatusProcessor.previousYear(yearStartDate);
        const previousPeriod: CommitStatusPeriod = {
            from: RepoCommitStatusProcessor.midnight(previousStartDate, timezone),
            to: rollingYear.from,
            effectiveTo: rollingYear.from,
        };
        const weeklyFromDate = RepoCommitStatusProcessor.monday(yearStartDate);
        const collectionFrom = RepoCommitStatusProcessor.midnight(
            previousStartDate < weeklyFromDate ? previousStartDate : weeklyFromDate,
            timezone,
        );
        const snapshot = await this.snapshot(
            input,
            collectionFrom,
            rollingYear.to,
            asOf,
            today,
            timezone,
            "getOverview",
        );

        const start = process.hrtime.bigint();
        const { commits, complete } = snapshot;
        const yearCommits = RepoCommitStatusProcessor.within(commits, rollingYear);
        const previousYearCommits = RepoCommitStatusProcessor.within(commits, previousPeriod);
        const weeklyPoints = RepoCommitStatusProcessor.weeks(
            commits,
            weeklyFromDate,
            today,
            timezone,
        );
        const codePoints = weeklyPoints.map(({ from, to, count, additions, deletions, net }) => ({
            from,
            to,
            count,
            additions,
            deletions,
            net,
        }));
        const additions = codePoints.reduce((sum, point) => sum + point.additions, 0);
        const deletions = codePoints.reduce((sum, point) => sum + point.deletions, 0);
        const weeklyPeriod = {
            from: RepoCommitStatusProcessor.midnight(weeklyFromDate, timezone),
            to: rollingYear.to,
            effectiveTo: rollingYear.to,
        };
        const periodCounts = ([7, 30, 90] as const).map((days) => {
            const period = RepoCommitStatusProcessor.daysPeriod(today, days, timezone);
            const previousPeriod: CommitStatusPeriod = {
                from: RepoCommitStatusProcessor.midnight(
                    RepoCommitStatusProcessor.moveDate(today, -2 * days),
                    timezone,
                ),
                to: period.from,
                effectiveTo: period.from,
            };
            const count = RepoCommitStatusProcessor.within(commits, period).length;
            const previousCount = RepoCommitStatusProcessor.within(commits, previousPeriod).length;
            return {
                days,
                period,
                count,
                previousPeriod,
                previousCount,
                changePercent: RepoCommitStatusProcessor.growth(count, previousCount),
            };
        });
        const timePeriod = RepoCommitStatusProcessor.daysPeriod(today, 90, timezone);
        const timeCommits = RepoCommitStatusProcessor.within(commits, timePeriod);
        const buckets = ([0, 4, 8, 12, 16, 20] as const).map((startHour) => ({
            startHour,
            count: 0,
        }));
        for (const commit of timeCommits) {
            const hour = RepoCommitStatusProcessor.localParts(commit.committedAt, timezone).hour;
            buckets[Math.floor(hour / 4)].count++;
        }
        const peak = buckets.reduce((best, item) => (item.count > best.count ? item : best));
        const midday = buckets
            .filter((item) => item.startHour >= 12 && item.startHour < 20)
            .reduce((sum, item) => sum + item.count, 0);

        const elapsed = process.hrtime.bigint() - start;
        //console.log(`[getOverview]  ${Number(elapsed) / 1e6}ms`);

        return {
            asOf,
            timezone,
            branch: snapshot.branch,
            headSha: snapshot.headSha,
            basis: { scope: "default_branch_history", includeMerges: true },
            rollingYear,
            weekly: this.metric(
                {
                    period: weeklyPeriod,
                    points: weeklyPoints.map(({ from, to, count }) => ({ from, to, count })),
                },
                complete,
            ),
            yearly: this.metric(
                {
                    period: rollingYear,
                    count: yearCommits.length,
                    previousPeriod,
                    previousCount: previousYearCommits.length,
                    changePercent: RepoCommitStatusProcessor.growth(
                        yearCommits.length,
                        previousYearCommits.length,
                    ),
                },
                complete,
            ),
            periods: this.metric(periodCounts, complete),
            codeChange: this.metric(
                {
                    period: weeklyPeriod,
                    granularity: "week",
                    points: codePoints,
                    additions,
                    deletions,
                    net: additions - deletions,
                    additionsPercent:
                        additions + deletions ? (additions * 100) / (additions + deletions) : null,
                    deletionsPercent:
                        additions + deletions ? (deletions * 100) / (additions + deletions) : null,
                },
                complete,
            ),
            timeOfDay: this.metric(
                {
                    period: timePeriod,
                    buckets,
                    peakStartHour: peak.count ? peak.startHour : null,
                    middayPercent: timeCommits.length ? (midday * 100) / timeCommits.length : null,
                },
                complete,
            ),
        };
    }

    /** 최근 완료된 1년 또는 명시적 전체 기간의 전적을 반환합니다. */
    public async getRecords(input: Request): Promise<GetRepoCommitStatusRecordsData> {
        const { timezone } = this.parse(input);
        if (input.scope !== undefined && input.scope !== "rolling_year" && input.scope !== "all") {
            throw CommonError.create400Error("전적 범위는 rolling_year 또는 all이어야 합니다.");
        }
        const scope = input.scope === "all" ? "all" : "rolling_year";
        const asOf = new Date().toISOString();
        const today = RepoCommitStatusProcessor.localParts(asOf, timezone).date;
        const period =
            scope === "all" ? null : RepoCommitStatusProcessor.yearPeriod(today, timezone);
        const snapshot = await this.snapshot(
            input,
            period?.from,
            RepoCommitStatusProcessor.midnight(today, timezone),
            asOf,
            today,
            timezone,
            "getRecords",
        );

        const start = process.hrtime.bigint();
        const { commits, complete } = snapshot;
        const selected = period
            ? RepoCommitStatusProcessor.within(commits, period)
            : commits.filter(
                  (commit) =>
                      Date.parse(commit.committedAt) <
                      Date.parse(RepoCommitStatusProcessor.midnight(today, timezone)),
              );
        const fromDate = period
            ? RepoCommitStatusProcessor.localParts(period.from, timezone).date
            : selected.length
              ? RepoCommitStatusProcessor.localParts(
                    selected.reduce((oldest, item) =>
                        Date.parse(item.committedAt) < Date.parse(oldest.committedAt)
                            ? item
                            : oldest,
                    ).committedAt,
                    timezone,
                ).date
              : today;
        const points = RepoCommitStatusProcessor.weeks(selected, fromDate, today, timezone);
        const dates = new Map<string, number>();
        for (const commit of selected) {
            const date = RepoCommitStatusProcessor.localParts(commit.committedAt, timezone).date;
            dates.set(date, (dates.get(date) ?? 0) + 1);
        }
        const activeWeeks = points.filter((point) => point.count > 0);
        const busiest = activeWeeks.reduce<(typeof points)[number] | null>(
            (best, point) => (!best || point.count > best.count ? point : best),
            null,
        );
        const latest = selected.reduce<CommitStatusCommit | null>(
            (best, item) =>
                !best || Date.parse(item.committedAt) > Date.parse(best.committedAt) ? item : best,
            null,
        );
        const totalDays = Math.max(
            0,
            Math.round(
                (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) /
                    86_400_000,
            ),
        );
        let gap = 0;
        let longestGap: { days: number; from: string; to: string } | null = null;
        let gapStart = fromDate;
        for (
            let date = fromDate;
            date < today;
            date = RepoCommitStatusProcessor.moveDate(date, 1)
        ) {
            if (dates.has(date)) {
                gap = 0;
                gapStart = RepoCommitStatusProcessor.moveDate(date, 1);
                continue;
            }
            gap++;
            if (!longestGap || gap > longestGap.days) {
                longestGap = {
                    days: gap,
                    from: gapStart,
                    to: RepoCommitStatusProcessor.moveDate(date, 1),
                };
            }
        }
        const elapsed = process.hrtime.bigint() - start;
        //console.log(`[getRecords]  ${Number(elapsed) / 1e6}ms`);
        return {
            asOf,
            timezone,
            scope,
            period,
            branch: snapshot.branch,
            headSha: snapshot.headSha,
            totalCommits: this.metric(selected.length, complete),
            activeDays: this.metric(
                {
                    count: dates.size,
                    totalDays,
                    percentage: totalDays ? (dates.size * 100) / totalDays : null,
                },
                complete,
            ),
            activeWeeks: this.metric(activeWeeks.length, complete),
            avgCommitsPerActiveWeek: this.metric(
                activeWeeks.length ? selected.length / activeWeeks.length : 0,
                complete,
            ),
            avgCommitsPerActiveDay: this.metric(
                dates.size ? selected.length / dates.size : 0,
                complete,
            ),
            busiestWeek: this.metric(
                busiest ? { from: busiest.from, to: busiest.to, count: busiest.count } : null,
                complete,
            ),
            lastCommit: this.metric(
                latest ? { sha: latest.sha, committedAt: latest.committedAt } : null,
                complete,
            ),
            longestInactiveDays: this.metric(longestGap, complete),
            longestActiveWeeks: this.metric(
                RepoCommitStatusProcessor.activeWeekStreak(points),
                complete,
            ),
        };
    }
}

export default new RepoCommitStatusServices();
