import type { GetRepoProjectHistoryData, GetRepoProjectParticipationData } from "../types/controllers/repo-project";
import type { GithubIssuesHistoryDto, GithubReposHistoryCommitsDto } from "../types/services/repo-project-history";

export interface HistoryMonth { month: string; start: number; end: number }
export interface WorkItemAuthors {
    issueAuthors: Set<number>[];
    prAuthors: Set<number>[];
    oldest: number;
}

class RepoProjectHistoryProcessor {
    /**
     * 현재 UTC 월을 제외한 최근 완료된 6개월의 경계를 구합니다.
     * @param now 조회 기준 시각.
     * @returns 각 월의 이름과 UTC 시작·종료 시각.
     */
    public static completedMonths(now: Date): HistoryMonth[] {
        return Array.from({ length: 6 }, (_, index) => {
            const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 6 + index, 1);
            const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1);
            return { month: new Date(start).toISOString().slice(0, 7), start, end };
        });
    }

    /**
     * 월별 파일·용량 결과에서 누락 월과 부분 조회 여부를 계산합니다.
     * @param months 월별 파일 수와 관측 용량.
     * @returns 월별 이력과 커버리지 정보.
     */
    public static summarizeHistory(months: GetRepoProjectHistoryData["months"]): GetRepoProjectHistoryData {
        const missingFileCountMonths = months.filter(({ fileCount }) => fileCount === null).map(({ month }) => month);
        const unobservedDiskUsageMonths = months.filter(({ diskUsageKb }) => diskUsageKb === null).map(({ month }) => month);
        return {
            months,
            coverage: { missingFileCountMonths, unobservedDiskUsageMonths },
            partial: missingFileCountMonths.length > 0 || unobservedDiskUsageMonths.length > 0,
        };
    }

    /**
     * 이슈·PR 페이지의 작성자를 월별로 중복 제거해 누적합니다.
     * @param current 이전 페이지까지의 작성자 집합과 가장 오래된 시각.
     * @param items 현재 페이지의 이슈·PR 목록.
     * @param months 집계 대상 월의 경계.
     * @returns 갱신된 작성자 집합과 가장 오래된 시각.
     */
    public static collectWorkItemAuthors(current: WorkItemAuthors, items: GithubIssuesHistoryDto["data"], months: readonly HistoryMonth[]): WorkItemAuthors {
        const issueAuthors = current.issueAuthors.map((authors) => new Set(authors));
        const prAuthors = current.prAuthors.map((authors) => new Set(authors));
        let oldest = current.oldest;
        for (const item of items) {
            const date = Date.parse(item.created_at);
            oldest = Math.min(oldest, date);
            if (!item.user) continue;
            const index = months.findIndex(({ start, end }) => date >= start && date < end);
            if (index >= 0) (item.pull_request ? prAuthors : issueAuthors)[index].add(item.user.id);
        }
        return { issueAuthors, prAuthors, oldest };
    }

    /**
     * 커밋 페이지에서 작성자별 최초 커밋 시각을 누적합니다.
     * @param current 이전 페이지까지의 작성자별 최초 시각.
     * @param commits 현재 페이지의 커밋 목록.
     * @returns 갱신된 작성자별 최초 시각.
     */
    public static collectCommitAuthors(current: ReadonlyMap<number, number>, commits: GithubReposHistoryCommitsDto["data"]): Map<number, number> {
        const firstCommitByAuthor = new Map(current);
        for (const commit of commits) {
            const id = commit.author?.id;
            const date = Date.parse(commit.commit.committer?.date ?? "");
            if (id === undefined || !Number.isFinite(date)) continue;
            const first = firstCommitByAuthor.get(id);
            if (first === undefined || date < first) firstCommitByAuthor.set(id, date);
        }
        return firstCommitByAuthor;
    }

    /**
     * 월별 이슈·PR 작성자 및 누적 기여자 수를 계산합니다.
     * @param months 집계 대상 월의 경계.
     * @param createdAt 저장소 생성 시각(밀리초).
     * @param workItems 이슈·PR 작성자 집합과 조회 완결 여부.
     * @param commits 커밋 작성자의 최초 시각과 조회 완결 여부.
     * @returns 월별 참여 현황과 부분 조회 여부.
     */
    public static summarizeParticipation(
        months: readonly HistoryMonth[],
        createdAt: number,
        workItems: WorkItemAuthors & { complete: boolean },
        commits: { firstCommitByAuthor: ReadonlyMap<number, number>; complete: boolean },
    ): GetRepoProjectParticipationData {
        const results = months.map(({ month, start, end }, index) => {
            const repositoryExisted = !(createdAt >= end);
            const workItemsComplete = workItems.complete || start > workItems.oldest;
            return {
                month,
                issueAuthors: repositoryExisted && workItemsComplete ? workItems.issueAuthors[index].size : null,
                prAuthors: repositoryExisted && workItemsComplete ? workItems.prAuthors[index].size : null,
                contributors: repositoryExisted && commits.complete
                    ? [...commits.firstCommitByAuthor.values()].filter((date) => date < end).length
                    : null,
            };
        });
        const latestContributor = [...results].reverse().find(({ contributors }) => contributors !== null);
        return {
            months: results,
            latestContributorCount: latestContributor?.contributors ?? null,
            latestContributorMonth: latestContributor?.month ?? null,
            partial: results.some(({ issueAuthors, prAuthors, contributors }) =>
                issueAuthors === null || prAuthors === null || contributors === null,
            ),
        };
    }
}

export default RepoProjectHistoryProcessor;
