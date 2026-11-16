import redisRepository from "../repository/redis.repository";
import githubRepoAPIClient from "../client/repo.client";
import type { RepoActivityQueryVariables } from "../types/github/graphql/operations.generated";
import type { GetRepoActivitySummaryDto } from "../types/response/repo-activity-summary";
import type { GetRepoActivityDto, RepoActivityCounts, RepoActivityEvent } from "../types/response/repo-activity";
import {
    calculateLanguageStats,
    CommitStats,
    LanguageStat,
    calculateCommitStats,
    ProjectCategoryStat,
    calculateProjectCategories,
    calculateDeveloperProfile,
    DeveloperProfileStats,
    calculateProjectHealth,
    ProjectHealthStats,
} from "../utils/stat";
import CommonError from "../utils/common-error";

const REDIS_DATA_EXPIRATION = 300; // 5분 동안 유지

const createRedisKey = (githubUsername: string, dataType: string) => {
    return `gitshboard:stats:${githubUsername}:${dataType}`;
};

class RepoService {
    public getActivity = async ({
        owner, repo, timezone, limit, cursor, token,
    }: {
        owner: string;
        repo: string;
        timezone: string;
        limit: number;
        cursor?: unknown;
        token?: string;
    }): Promise<GetRepoActivityDto> => {
        const scope = `${owner.toLowerCase()}/${repo.toLowerCase()}:${timezone}`;
        let asOf = new Date().toISOString();
        let previous: { occurredAt: string; id: string } | undefined;
        if (cursor !== undefined) {
            try {
                if (typeof cursor !== "string" || !/^[\w-]{1,4096}$/.test(cursor)) throw new Error();
                const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
                if (
                    parsed.scope !== scope || typeof parsed.asOf !== "string" ||
                    new Date(parsed.asOf).toISOString() !== parsed.asOf ||
                    Date.parse(parsed.asOf) > Date.now() ||
                    Date.now() - Date.parse(parsed.asOf) > 60 * 60 * 1000 ||
                    typeof parsed.occurredAt !== "string" ||
                    new Date(parsed.occurredAt).toISOString() !== parsed.occurredAt ||
                    typeof parsed.id !== "string" || !parsed.id
                ) throw new Error();
                asOf = parsed.asOf;
                previous = { occurredAt: parsed.occurredAt, id: parsed.id };
            } catch {
                throw CommonError.create400Error("활동 페이지 커서가 잘못되었거나 만료되었습니다.");
            }
        }

        const { events, counts, window, truncatedSources, canonicalOwner, canonicalRepo } =
            await this.scanActivity(owner, repo, timezone, token, asOf, false);
        const sorted = events.sort((a, b) =>
            b.occurredAt.localeCompare(a.occurredAt) || a.id.localeCompare(b.id),
        );
        const remaining = previous ? sorted.filter((event) =>
            event.occurredAt < previous.occurredAt ||
            (event.occurredAt === previous.occurredAt && event.id.localeCompare(previous.id) > 0),
        ) : sorted;
        const pageEvents = remaining.slice(0, limit);
        const last = pageEvents[pageEvents.length - 1];
        const nextCursor = last && remaining.length > pageEvents.length ? Buffer.from(JSON.stringify({
            scope, asOf, occurredAt: last.occurredAt, id: last.id,
        })).toString("base64url") : null;

        let commitDetailsPartial = false;
        for (const event of pageEvents) {
            if (event.type !== "commit" || event.changedFiles === 0) continue;
            try {
                const commit_response = await githubRepoAPIClient.getActivityCommit(
                    canonicalOwner, canonicalRepo, event.sha, token,
                );
                event.representativePath = commit_response.files?.[0]?.filename;
            } catch {
                commitDetailsPartial = true;
                // The feed remains available when optional commit details cannot be fetched.
                break;
            }
        }

        return {
            asOf, window, counts, events: pageEvents, nextCursor,
            coverage: { truncatedSources, commitDetailsPartial },
        };
    };

    public getActivitySummary = async ({
        owner, repo, timezone, token,
    }: {
        owner: string;
        repo: string;
        timezone: string;
        token?: string;
    }): Promise<GetRepoActivitySummaryDto> => {
        const asOf = new Date().toISOString();
        const { events, counts, window, dates, clock, dateKey, responseTimes, truncatedSources, issueResponseSamplePartial } =
            await this.scanActivity(owner, repo, timezone, token, asOf, true);

        const emptyCounts: RepoActivityCounts = { commit: 0, "pull-request": 0, issue: 0 };
        const days = dates.map((date) => ({ date, total: 0, counts: { ...emptyCounts } }));
        const hours = Array.from({ length: 6 }, (_, index) => ({
            fromHour: index * 4, toHour: (index + 1) * 4, count: 0,
        }));
        for (const event of events.values()) {
            const day = days.find(({ date }) => date === dateKey(event.occurredAt));
            const hour = clock.formatToParts(new Date(event.occurredAt)).find((part) => part.type === "hour");
            if (day) {
                day.total++;
                day.counts[event.type]++;
            }
            if (hour) hours[Math.floor(Number(hour.value) / 4)].count++;
        }

        const total = events.length;
        const peakDay = total ? days.reduce((peak, day) => day.total > peak.total ? day : peak) : null;
        const peakHours = total ? hours.reduce((peak, hour) => hour.count > peak.count ? hour : peak) : null;
        const weekdayTotal = days.reduce((sum, day) => {
            const weekday = new Date(day.date).getUTCDay();
            return weekday >= 1 && weekday <= 5 ? sum + day.total : sum;
        }, 0);
        const dailyCommits = days.map(({ date, counts }) => ({ date, count: counts.commit }));
        const activeCommitDays = dailyCommits.filter(({ count }) => count > 0).length;
        responseTimes.sort((a, b) => a - b);
        const middle = Math.floor(responseTimes.length / 2);
        const firstResponseMedianSeconds = responseTimes.length === 0 ? null
            : responseTimes.length % 2 ? responseTimes[middle]
                : (responseTimes[middle - 1] + responseTimes[middle]) / 2;
        const badges: GetRepoActivitySummaryDto["badges"] = [];
        if (Object.values(counts).every((count) => count > 0)) badges.push("active-project");
        if (activeCommitDays >= 5) badges.push("steady-commits");
        if (!issueResponseSamplePartial && !truncatedSources.includes("issue") && responseTimes.length >= 3 &&
            firstResponseMedianSeconds !== null && firstResponseMedianSeconds <= 24 * 60 * 60) {
            badges.push("fast-issue-response");
        }

        return {
            asOf, window, counts, dailyCommits, peakDay, peakHours, weekdayShare: total ? weekdayTotal / total : null,
            activeCommitDays, firstResponseMedianSeconds, badges,
            coverage: { truncatedSources, issueResponseSamplePartial },
        };
    };

    private async scanActivity(
        owner: string,
        repo: string,
        timezone: string,
        token: string | undefined,
        asOf: string,
        includeSummary: boolean,
    ) {
        const clockOptions: Intl.DateTimeFormatOptions = {
            timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", hourCycle: "h23",
        };
        let clock: Intl.DateTimeFormat;
        try {
            clock = new Intl.DateTimeFormat("sv-SE", clockOptions);
        } catch {
            throw CommonError.create400Error("올바른 IANA 시간대가 필요합니다.");
        }

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
        // The extra UTC day covers local dates that start before UTC midnight.
        const since = new Date(lastDateMidnight - 7 * dayMs).toISOString();
        const inWindow = (value: string) =>
            Date.parse(value) < Date.parse(asOf) && dateKey(value) >= dates[0];
        const variables: RepoActivityQueryVariables = {
            owner, name: repo, since, until: asOf, includeSummary,
            readCommits: true, readPullRequests: true, readIssues: true,
        };
        const events = new Map<string, RepoActivityEvent>();
        const responseTimes: number[] = [];
        let issueResponseSamplePartial = false;
        let canonicalOwner = owner;
        let canonicalRepo = repo;

        // A bounded scan keeps the synchronous endpoint usable on busy repositories.
        for (let page = 0; page < 10; page++) {
            const response = await githubRepoAPIClient.getActivityPage(variables, token);
            const repository = response.repository;
            if (!repository || (!token && repository.visibility !== "PUBLIC")) {
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            }
            canonicalOwner = repository.owner.login;
            canonicalRepo = repository.name;
            const commitTarget = repository.defaultBranchRef?.target;
            const commits = commitTarget && "history" in commitTarget ? commitTarget.history : undefined;
            const { pullRequests, issues } = repository;

            for (const commit of commits?.nodes ?? []) {
                if (!commit || !inWindow(commit.committedDate)) continue;
                const occurredAt = new Date(commit.committedDate).toISOString();
                const id = `commit:${commit.oid}:committed:${occurredAt}`;
                events.set(id, {
                    id, type: "commit", action: "committed", title: commit.messageHeadline,
                    actor: commit.author?.user?.login ?? commit.author?.name ?? null,
                    reference: commit.abbreviatedOid, url: commit.url, occurredAt,
                    sha: commit.oid, changedFiles: commit.changedFilesIfAvailable ?? null,
                });
            }

            for (const pr of pullRequests?.nodes ?? []) {
                if (!pr) continue;
                for (const [action, timestamp] of [["opened", pr.createdAt], ["merged", pr.mergedAt]] as const) {
                    if (!timestamp || !inWindow(timestamp)) continue;
                    const occurredAt = new Date(timestamp).toISOString();
                    const id = `pull-request:${pr.id}:${action}:${occurredAt}`;
                    events.set(id, {
                        id, type: "pull-request", action, title: pr.title,
                        actor: (action === "merged" ? pr.mergedBy : pr.author)?.login ?? null,
                        reference: `#${pr.number}`, url: pr.url, occurredAt,
                        baseBranch: pr.baseRefName, reviewCount: pr.reviews?.totalCount ?? null,
                        checkState: pr.statusCheckRollup?.state ?? null, draft: pr.isDraft,
                    });
                }
            }

            for (const issue of issues?.nodes ?? []) {
                if (!issue) continue;
                const labels = (issue.labels?.nodes ?? []).flatMap((label) => label ? [label.name] : []);
                for (const [action, timestamp] of [["opened", issue.createdAt], ["closed", issue.closedAt]] as const) {
                    if (!timestamp || !inWindow(timestamp)) continue;
                    const occurredAt = new Date(timestamp).toISOString();
                    const id = `issue:${issue.id}:${action}:${occurredAt}`;
                    if (action === "opened" && !events.has(id) && issue.comments) {
                        const reply = issue.comments.nodes?.find((comment) =>
                            comment?.author && comment.author.__typename !== "Bot" &&
                            comment.author.login !== issue.author?.login && Date.parse(comment.createdAt) < Date.parse(asOf),
                        );
                        if (reply) {
                            responseTimes.push((Date.parse(reply.createdAt) - Date.parse(issue.createdAt)) / 1000);
                        } else if (issue.comments.pageInfo.hasNextPage) {
                            issueResponseSamplePartial = true;
                        }
                    }
                    const closer = issue.timelineItems?.nodes?.find((event) =>
                        event && "createdAt" in event && Date.parse(event.createdAt) === Date.parse(timestamp),
                    );
                    events.set(id, {
                        id, type: "issue", action, title: issue.title,
                        actor: action === "opened" ? issue.author?.login ?? null
                            : closer && "actor" in closer ? closer.actor?.login ?? null : null,
                        reference: `#${issue.number}`, url: issue.url, occurredAt, labels,
                        closeReason: action === "closed" ? issue.stateReason ?? null : null,
                    });
                }
            }

            variables.commitAfter = commits?.pageInfo.endCursor;
            variables.pullRequestAfter = pullRequests?.pageInfo.endCursor;
            variables.issueAfter = issues?.pageInfo.endCursor;
            variables.readCommits = Boolean(commits?.pageInfo.hasNextPage && variables.commitAfter);
            variables.readPullRequests = Boolean(pullRequests?.pageInfo.hasNextPage && variables.pullRequestAfter &&
                !pullRequests.nodes?.some((pr) => pr && Date.parse(pr.updatedAt) < Date.parse(since)));
            variables.readIssues = Boolean(issues?.pageInfo.hasNextPage && variables.issueAfter &&
                !issues.nodes?.some((issue) => issue && Date.parse(issue.updatedAt) < Date.parse(since)));
            if (!variables.readCommits && !variables.readPullRequests && !variables.readIssues) break;
        }

        const counts: RepoActivityCounts = { commit: 0, "pull-request": 0, issue: 0 };
        for (const event of events.values()) counts[event.type]++;

        const truncatedSources: GetRepoActivityDto["coverage"]["truncatedSources"] = [];
        if (variables.readCommits) truncatedSources.push("commit");
        if (variables.readPullRequests) truncatedSources.push("pull-request");
        if (variables.readIssues) truncatedSources.push("issue");

        return {
            events: [...events.values()], counts, dates, clock, dateKey, responseTimes,
            window: { firstDate: dates[0], lastDate, timezone },
            truncatedSources, issueResponseSamplePartial, canonicalOwner, canonicalRepo,
        };
    }

    public getLanguages = async (githubUsername: string, githubAccessToken: string | undefined) => {
        const cachedData = await redisRepository.get<LanguageStat[]>(
            createRedisKey(githubUsername, "languages"),
        );

        if (cachedData) {
            console.log("Redis hit : languages");
            return cachedData;
        }

        try {
            const userData = await githubRepoAPIClient.getLanguages(githubUsername, githubAccessToken);
            if (!userData) {
                throw CommonError.create404Error(
                    "Github API 호출에 실패했습니다.",
                    `/api/repo/${githubUsername}/languages`,
                );
            }

            const languageStats = calculateLanguageStats(userData);
            const success = await redisRepository.set(
                createRedisKey(githubUsername, "languages"),
                languageStats,
                REDIS_DATA_EXPIRATION,
            );

            if (!success) {
                console.error("Failed to set cache for languages");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }
            return languageStats;
        } catch (err) {
            console.error("Failed to fetch repository languages:", err);
            return null;
        }
    };

    public getCommitTime = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        const cachedData = await redisRepository.get<CommitStats>(
            createRedisKey(githubUsername, "commitTime"),
        );

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : commitTime");
            return cachedData;
        }

        try {
            const userData = await githubRepoAPIClient.getCommitTime(githubUsername, githubAccessToken);
            if (!userData) {
                throw new Error("Failed to fetch commit time from GitHub API");
            }

            const commitStats: CommitStats = calculateCommitStats(userData);
            const success = await redisRepository.set(
                createRedisKey(githubUsername, "commitTime"),
                commitStats,
                REDIS_DATA_EXPIRATION,
            );
            if (!success) {
                console.error("Failed to set cache for commit time");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }
            // console.log("[backend] commitStats:", commitStats);

            return commitStats;
        } catch (err) {
            console.error("Failed to fetch commit time data:", err);
            return null;
        }
    };

    public getProjectTopics = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        const cachedData = await redisRepository.get<ProjectCategoryStat[]>(
            createRedisKey(githubUsername, "projectTopics"),
        );

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : projectTopics");
            return cachedData;
        }

        try {
            const userData = await githubRepoAPIClient.getProjectTopics(githubUsername, githubAccessToken);
            if (!userData) {
                throw new Error("Failed to fetch project topics from GitHub API");
            }
            const projectTopics: ProjectCategoryStat[] = calculateProjectCategories(userData);
            const success = await redisRepository.set(
                createRedisKey(githubUsername, "projectTopics"),
                projectTopics,
                REDIS_DATA_EXPIRATION,
            );
            if (!success) {
                throw new Error("Failed to set cache for project topics");
            }
            return projectTopics;
        } catch (err) {
            console.error("Failed to fetch project topics:", err);
            return null;
        }
    };

    public getDevelopStats = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        //304 Not Modified 요청에 대한 대비
        const cachedData = await redisRepository.get<DeveloperProfileStats>(
            createRedisKey(githubUsername, "developStats"),
        );

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : developStats");
            return cachedData;
        }

        try {
            const userData = await githubRepoAPIClient.getDevelopStats(githubUsername, githubAccessToken);
            if (!userData) {
                throw new Error("Failed to fetch develop stats from GitHub API");
            }
            const developerProfileStats: DeveloperProfileStats =
                calculateDeveloperProfile(userData);
            const success = await redisRepository.set(
                createRedisKey(githubUsername, "developStats"),
                developerProfileStats,
                REDIS_DATA_EXPIRATION,
            );

            if (!success) {
                console.error("Failed to set cache for develop stats");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }

            return developerProfileStats;
        } catch (err) {
            console.error("Failed to fetch develop stats:", err);
            return null;
        }
    };

    public getProjectLiveRate = async (
        githubUsername: string,
        githubAccessToken: string | undefined,
    ) => {
        //304 Not Modified 요청에 대한 대비
        const cachedData = await redisRepository.get<ProjectHealthStats>(
            createRedisKey(githubUsername, "projectLiveRate"),
        );

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : projectLiveRate");
            return cachedData;
        }

        try {
            const userData = await githubRepoAPIClient.getProjectLiveRate(githubUsername, githubAccessToken);
            if (!userData) {
                throw new Error("Failed to fetch project live rate from GitHub API");
            }

            const projectHealthStats = calculateProjectHealth(userData);
            const success = await redisRepository.set(
                createRedisKey(githubUsername, "projectLiveRate"),
                projectHealthStats,
                REDIS_DATA_EXPIRATION,
            );
            if (!success) {
                console.error("Failed to set cache for project live rate");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }

            return projectHealthStats;
        } catch (err) {
            console.error("Failed to fetch project live rate:", err);
            return null;
        }
    };
}

const repoService = new RepoService();
export default repoService;
