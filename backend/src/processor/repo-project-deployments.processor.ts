import type { GetRepoProjectDeploymentsData } from "../types/controllers/repo-project";
import type { GithubGQLGetRepoProjectDeploymentsQuery } from "../types/github/graphql/operations.generated";

export type Deployment = NonNullable<NonNullable<
    NonNullable<GithubGQLGetRepoProjectDeploymentsQuery["repository"]>["deployments"]["nodes"]
>[number]>;
export type Status = NonNullable<NonNullable<NonNullable<Deployment["statuses"]>["nodes"]>[number]>;

const DEPLOYMENT_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;
const productionHour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul", hour: "2-digit", hourCycle: "h23",
});

class RepoProjectDeploymentsProcessor {
    /**
     * 조회 페이지에서 기간 안의 배포를 고르고 누락 및 오래된 항목 여부를 계산합니다.
     * @param nodes GitHub 배포 목록의 노드.
     * @param asOf 조회 스냅샷 시각(밀리초).
     * @returns 선택한 배포, 오래된 항목 여부, 누락 여부.
     */
    public static selectDeployments(nodes: NonNullable<GithubGQLGetRepoProjectDeploymentsQuery["repository"]>["deployments"]["nodes"], asOf: number) {
        const selected: Deployment[] = [];
        let olderDeploymentFound = false;
        let partial = false;
        const cutoff = asOf - DEPLOYMENT_WINDOW_MS;
        for (const item of nodes ?? []) {
            if (!item) {
                partial = true;
                continue;
            }
            const createdAt = Date.parse(item.createdAt);
            if (createdAt < cutoff) olderDeploymentFound = true;
            else if (createdAt <= asOf) selected.push(item);
        }
        return { selected, olderDeploymentFound, partial };
    }

    /**
     * 배포와 상태 이력으로 성공률, 소요 시간, 시간대별 건수를 계산합니다.
     * @param records 배포와 각각의 상태 이력. null 이력은 일부 조회 실패를 뜻합니다.
     * @param asOf 조회 스냅샷 시각(밀리초).
     * @returns 배포 통계와 상태 이력의 부분 조회 여부.
     */
    public static summarize(records: readonly { deployment: Deployment; timeline: Status[] | null }[], asOf: number): GetRepoProjectDeploymentsData {
        let completed = 0;
        let successful = 0;
        let partial = false;
        const durations: number[] = [];
        const hourBuckets = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
        for (const { deployment, timeline } of records) {
            const statuses = timeline?.filter((status) => Date.parse(status.createdAt) <= asOf)
                .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)) ?? [];
            if (timeline === null) partial = true;

            const started = statuses.find(({ state }) => state === "IN_PROGRESS");
            const hour = Number(productionHour.format(new Date(started?.createdAt ?? deployment.createdAt)));
            hourBuckets[hour].count++;

            // 성공 이후 INACTIVE 상태가 추가될 수 있으므로 마지막 종료 상태를 선택합니다.
            const terminal = statuses.filter(({ state }) =>
                state === "SUCCESS" || state === "FAILURE" || state === "ERROR",
            ).pop();
            if (!terminal) continue;

            completed++;
            if (terminal.state !== "SUCCESS") continue;
            successful++;
            if (started) {
                const duration = (Date.parse(terminal.createdAt) - Date.parse(started.createdAt)) / 1000;
                if (duration >= 0) durations.push(duration);
            }
        }

        durations.sort((a, b) => a - b);
        const middle = Math.floor(durations.length / 2);
        const medianDurationSeconds = durations.length === 0 ? null
            : durations.length % 2 === 1 ? durations[middle]
                : (durations[middle - 1] + durations[middle]) / 2;
        const peak = hourBuckets.reduce((previous, bucket) => bucket.count > previous.count ? bucket : previous);
        return {
            attempts: records.length,
            completed,
            successful,
            successRatePercent: completed > 0 ? (successful / completed) * 100 : null,
            attemptsPerWeek: records.length * (7 * 24 * 60 * 60 * 1000) / DEPLOYMENT_WINDOW_MS,
            medianDurationSeconds,
            // 커밋 시각만으로 기본 브랜치에 도달한 시각을 알 수 없습니다.
            medianLeadTimeSeconds: null,
            peakHour: peak.count ? peak.hour : null,
            hourBuckets,
            partial,
        };
    }
}

export default RepoProjectDeploymentsProcessor;
