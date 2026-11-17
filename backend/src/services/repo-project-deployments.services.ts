import githubDeploymentsClient from "../client/repo-project-deployments.client";
import type { GetRepoProjectDeploymentsData } from "../types/controllers/repo-project";
import type { GithubGQLGetRepoProjectDeploymentsQuery } from "../types/github/graphql/operations.generated";
import CommonError from "../utils/common-error";

const MAX_DEPLOYMENT_PAGES = 10;
const MAX_CONTINUATION_PAGES = 3;
const DEPLOYMENT_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;
const productionHour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    hourCycle: "h23",
});

type Deployment = NonNullable<NonNullable<
    NonNullable<GithubGQLGetRepoProjectDeploymentsQuery["repository"]>["deployments"]["nodes"]
>[number]>;
type Status = NonNullable<NonNullable<NonNullable<Deployment["statuses"]>["nodes"]>[number]>;

class RepoProjectDeploymentsServices {
    public async getDeployments(
        owner: string,
        repo: string,
        token?: string,
    ): Promise<GetRepoProjectDeploymentsData> {
        const asOf = Date.now();
        const cutoff = asOf - DEPLOYMENT_WINDOW_MS;
        const deployments = new Map<string, Deployment>();
        let after: string | null = null;
        let partial = false;
        for (let page = 0; page < MAX_DEPLOYMENT_PAGES; page++) {
            const { repository } = await githubDeploymentsClient.getDeployments({ owner, name: repo, after }, token);
            if (!repository || (!token && repository.visibility !== "PUBLIC")) {
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            }

            let olderDeploymentFound = false;
            for (const item of repository.deployments.nodes ?? []) {
                if (!item) {
                    partial = true;
                    continue;
                }
                const createdAt = Date.parse(item.createdAt);
                if (createdAt < cutoff) olderDeploymentFound = true;
                else if (createdAt <= asOf) deployments.set(item.id, item);
            }

            const { hasNextPage, endCursor } = repository.deployments.pageInfo;
            if (olderDeploymentFound || !hasNextPage) break;
            if (!endCursor || endCursor === after || page === MAX_DEPLOYMENT_PAGES - 1) {
                partial = true;
                break;
            }
            after = endCursor;
        }

        let completed = 0;
        let successful = 0;
        const durations: number[] = [];
        const hourBuckets = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
        for (const deployment of deployments.values()) {
            const timeline = await this.getTimeline(deployment, token);
            const statuses = timeline?.filter((status) => Date.parse(status.createdAt) <= asOf)
                .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)) ?? [];
            if (timeline === null) partial = true;

            const started = statuses.find(({ state }) => state === "IN_PROGRESS");
            const hour = Number(productionHour.format(new Date(started?.createdAt ?? deployment.createdAt)));
            hourBuckets[hour].count++;

            // An inactive status may be appended to an already successful deployment.
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
            attempts: deployments.size,
            completed,
            successful,
            successRatePercent: completed > 0 ? (successful / completed) * 100 : null,
            attemptsPerWeek: deployments.size * (7 * 24 * 60 * 60 * 1000) / DEPLOYMENT_WINDOW_MS,
            medianDurationSeconds,
            // A commit timestamp does not identify when the commit reached the default branch.
            medianLeadTimeSeconds: null,
            peakHour: peak.count ? peak.hour : null,
            hourBuckets,
            partial,
        };
    }

    private async getTimeline(deployment: Deployment, token?: string): Promise<Status[] | null> {
        let connection = deployment.statuses;
        const statuses = new Map<string, Status>();
        const requestedCursors = new Set<string>();

        for (let page = 0; page <= MAX_CONTINUATION_PAGES; page++) {
            if (!connection) return null;
            for (const status of connection.nodes ?? []) {
                if (!status) return null;
                statuses.set(status.id, status);
            }

            const { hasNextPage, endCursor } = connection.pageInfo;
            if (!hasNextPage) return [...statuses.values()];
            if (!endCursor || requestedCursors.has(endCursor) || page === MAX_CONTINUATION_PAGES) return null;
            requestedCursors.add(endCursor);

            try {
                const { node } = await githubDeploymentsClient.getDeploymentStatuses(
                    { id: deployment.id, after: endCursor }, token,
                );
                connection = node && "statuses" in node ? node.statuses : null;
            } catch {
                return null;
            }
        }
        return null;
    }
}

export default new RepoProjectDeploymentsServices();
