import redisRepository from "../repository/redis.repository";
import githubRepoAPIClient from "../client/repo.client";
import type { GithubGQLGetRepoActivityQueryVariables } from "../types/github/graphql/operations.generated";
import type {
    GetRepoActivityBranchesData,
    GetRepoActivityData,
    GetRepoActivitySummaryData,
    GetRepoProfileData,
    RepoActivityEvent,
} from "../types/controllers/repo";
import {
    calculateLanguageStats,
    CommitStats,
    LanguageStat,
    calculateCommitStats,
} from "../utils/stat";
import CommonError from "../utils/common-error";
import RepoUtils from "../utils/routes/repo.utils";
import RepoActivityMapper from "../mapper/repo-activity.mapper";
import RepoActivityProcessor from "../processor/repo-activity.processor";

const MAX_RECENT_ACTIVITY_EVENTS = 100;

const REDIS_DATA_EXPIRATION = 300; // 5분 동안 유지

const createRedisKey = (githubUsername: string, dataType: string) => {
    return `gitshboard:stats:${githubUsername}:${dataType}`;
};

class RepoServices {
    public getProfile = async ({
        owner,
        repo,
        token,
    }: {
        owner: unknown;
        repo: unknown;
        token?: string;
    }): Promise<GetRepoProfileData> => {
        if (
            typeof owner !== "string" ||
            typeof repo !== "string" ||
            !owner.trim() ||
            !repo.trim()
        ) {
            throw CommonError.create400Error("저장소 소유자와 이름이 필요합니다.");
        }

        const { repository } = await githubRepoAPIClient.getProfile({ owner, name: repo }, token);
        if (!repository || (!token && repository.visibility !== "PUBLIC")) {
            throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
        }

        return { repository };
    };

    public getActivity = async ({
        owner,
        repo,
        timezone = "Asia/Seoul",
        limit = "6",
        cursor,
        token,
        branch,
        source,
    }: {
        source: "commits" | "pull-requests-issues";
        branch?: unknown;
        owner: unknown;
        repo: unknown;
        timezone?: unknown;
        limit?: unknown;
        cursor?: unknown;
        token?: string;
    }): Promise<GetRepoActivityData> => {
        const location = RepoUtils.parseActivityLocation(owner, repo, timezone);
        if (!location || typeof limit !== "string" || !/^(?:[1-9]|1\d|20)$/.test(limit)) {
            throw CommonError.create400Error(
                "저장소 주소, 시간대 또는 페이지 크기를 확인해 주세요.",
            );
        }

        const selectedBranch = source === "commits" ? this.parseBranch(branch) : undefined;
        const scope = JSON.stringify([
            location.owner.toLowerCase(),
            location.repo.toLowerCase(),
            location.timezone,
            source,
            selectedBranch,
            "latest",
        ]);
        const now = Date.now();
        const previous = RepoUtils.decodeActivityCursor(cursor, scope, now);
        if (cursor !== undefined && !previous) {
            throw CommonError.create400Error("활동 페이지 커서가 잘못되었거나 만료되었습니다.");
        }

        const asOf = previous?.asOf ?? new Date(now).toISOString();
        const githubAccessToken = token || undefined;
        const { events, counts, window, truncatedSources, canonicalOwner, canonicalRepo } =
            await this.scanActivity(
                location.owner,
                location.repo,
                location.timezone,
                githubAccessToken,
                asOf,
                source,
                selectedBranch,
            );
        const remaining = previous
            ? events.filter(
                  (event) =>
                      event.occurredAt < previous.occurredAt ||
                      (event.occurredAt === previous.occurredAt &&
                          event.id.localeCompare(previous.id) > 0),
              )
            : events;
        const pageEvents = remaining.slice(0, Number(limit));
        const last = pageEvents[pageEvents.length - 1];
        const nextCursor =
            last && remaining.length > pageEvents.length
                ? RepoUtils.encodeActivityCursor(scope, {
                      asOf,
                      occurredAt: last.occurredAt,
                      id: last.id,
                  })
                : null;

        let commitDetailsPartial = false;
        for (const event of pageEvents) {
            if (event.type !== "commit" || event.changedFiles === 0) continue;
            try {
                const commit_response = await githubRepoAPIClient.getActivityCommit(
                    canonicalOwner,
                    canonicalRepo,
                    event.sha,
                    githubAccessToken,
                );
                event.representativePath = commit_response.files?.[0]?.filename;
            } catch {
                commitDetailsPartial = true;
                // The feed remains available when optional commit details cannot be fetched.
                break;
            }
        }

        return {
            asOf,
            window,
            counts,
            events: pageEvents,
            nextCursor,
            coverage: { truncatedSources, commitDetailsPartial },
        };
    };

    public getActivityBranches = async ({
        owner,
        repo,
        cursor,
        token,
    }: {
        owner: unknown;
        repo: unknown;
        cursor?: unknown;
        token?: string;
    }): Promise<GetRepoActivityBranchesData> => {
        const location = RepoUtils.parseActivityLocation(owner, repo, "UTC");
        if (
            !location ||
            (cursor !== undefined &&
                (typeof cursor !== "string" || cursor.length === 0 || cursor.length > 4096))
        ) {
            throw CommonError.create400Error("저장소 주소 또는 브랜치 커서를 확인해 주세요.");
        }
        const { repository } = await githubRepoAPIClient.getActivityBranches(
            {
                owner: location.owner,
                name: location.repo,
                after: cursor,
            },
            token || undefined,
        );
        if (!repository || (!token && repository.visibility !== "PUBLIC")) {
            throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
        }
        return {
            defaultBranch: repository.defaultBranchRef?.name ?? null,
            branches:
                repository.refs?.nodes?.flatMap((branch) => (branch ? [branch.name] : [])) ?? [],
            nextCursor: repository.refs?.pageInfo.hasNextPage
                ? (repository.refs.pageInfo.endCursor ?? null)
                : null,
        };
    };

    public getActivitySummary = async ({
        owner,
        repo,
        timezone = "Asia/Seoul",
        token,
        branch,
    }: {
        owner: unknown;
        repo: unknown;
        timezone?: unknown;
        token?: string;
        branch?: unknown;
    }): Promise<GetRepoActivitySummaryData> => {
        const location = RepoUtils.parseActivityLocation(owner, repo, timezone);
        if (!location) throw CommonError.create400Error("저장소 주소 또는 시간대를 확인해 주세요.");

        const asOf = new Date().toISOString();
        const selectedBranch = this.parseBranch(branch);
        const { events, counts, window, dates, dateKey, truncatedSources, branchName } =
            await this.scanActivity(
                location.owner,
                location.repo,
                location.timezone,
                token || undefined,
                asOf,
                "summary",
                selectedBranch,
            );
        const { dailyCommits, peakDay } = RepoActivityProcessor.summarizeByDay(
            events,
            dates,
            dateKey,
        );

        return {
            asOf,
            window,
            counts,
            branch: branchName,
            dailyCommits,
            peakDay,
            coverage: { truncatedSources },
        };
    };

    private parseBranch(branch: unknown): string | undefined {
        if (branch === undefined) return undefined;
        if (
            typeof branch !== "string" ||
            !branch ||
            branch.length > 1024 ||
            /[\s\x00-\x1f\x7f]/.test(branch)
        ) {
            throw CommonError.create400Error("브랜치 이름을 확인해 주세요.");
        }
        return branch;
    }

    private async scanActivity(
        owner: string,
        repo: string,
        timezone: string,
        token: string | undefined,
        asOf: string,
        source: "commits" | "pull-requests-issues" | "summary",
        branch?: string,
    ) {
        const clockOptions: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        let clock: Intl.DateTimeFormat;
        try {
            clock = new Intl.DateTimeFormat("sv-SE", clockOptions);
        } catch {
            throw CommonError.create400Error("올바른 IANA 시간대가 필요합니다.");
        }

        const { dates, lastDate, since, dateKey, inWindow } = RepoActivityProcessor.getWindow(
            asOf,
            clock,
        );
        const isSummary = source === "summary";
        const snapshotTime = Date.parse(asOf);
        const includeEvent = (value: string) =>
            isSummary ? inWindow(value) : Date.parse(value) <= snapshotTime;
        let variables: GithubGQLGetRepoActivityQueryVariables = {
            owner,
            name: repo,
            since: isSummary ? since : undefined,
            until: asOf,
            includeSummary: isSummary,
            qualifiedBranch: branch ? `refs/heads/${branch}` : "",
            readDefaultBranch: source !== "pull-requests-issues" && branch === undefined,
            readSelectedBranch: source !== "pull-requests-issues" && branch !== undefined,
            readPullRequests: source !== "commits",
            readIssues: source !== "commits",
        };
        let events = new Map<string, RepoActivityEvent>();
        let branchName: string | null = null;
        let canonicalOwner = owner;
        let canonicalRepo = repo;

        // A bounded scan keeps the synchronous endpoint usable on busy repositories.
        //TODO : N+1 문제로 fetch를 매번 해서 성능 박는 문제 주의
        for (let page = 0; page < 10; page++) {
            const response = await githubRepoAPIClient.getActivityPage(variables, token);
            const repository = response.repository;
            if (!repository || (!token && repository.visibility !== "PUBLIC")) {
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            }
            canonicalOwner = repository.owner.login;
            canonicalRepo = repository.name;
            const branchRef = variables.readSelectedBranch
                ? repository.selectedBranch
                : repository.defaultBranchRef;
            if (variables.readSelectedBranch && !branchRef) {
                throw CommonError.create404Error("브랜치를 찾을 수 없습니다.");
            }
            branchName = branchRef?.name ?? branchName;
            const commitTarget = branchRef?.target;
            const commits =
                commitTarget && "history" in commitTarget ? commitTarget.history : undefined;
            events = RepoActivityProcessor.collectEvents(
                events,
                RepoActivityMapper.toEvents(repository, commits),
                includeEvent,
            );
            variables = RepoActivityProcessor.nextPageVariables(
                variables,
                repository,
                commits,
                events,
                isSummary,
                since,
                MAX_RECENT_ACTIVITY_EVENTS,
            );
            if (
                !variables.readDefaultBranch &&
                !variables.readSelectedBranch &&
                !variables.readPullRequests &&
                !variables.readIssues
            )
                break;
        }

        const { orderedEvents, counts } = RepoActivityProcessor.summarize(
            events,
            isSummary,
            MAX_RECENT_ACTIVITY_EVENTS,
        );

        const truncatedSources = RepoActivityProcessor.truncatedSources(variables);

        return {
            events: orderedEvents,
            counts,
            dates,
            dateKey,
            branchName,
            window: {
                firstDate: isSummary
                    ? dates[0]
                    : dateKey(orderedEvents[orderedEvents.length - 1]?.occurredAt ?? asOf),
                lastDate,
                timezone,
            },
            truncatedSources,
            canonicalOwner,
            canonicalRepo,
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
            const userData = await githubRepoAPIClient.getLanguages(
                githubUsername,
                githubAccessToken,
            );
            if (!userData) {
                throw CommonError.create404Error("Github API 호출에 실패했습니다.");
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
            const userData = await githubRepoAPIClient.getCommitTime(
                githubUsername,
                githubAccessToken,
            );
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
}

const repoService = new RepoServices();
export default repoService;
