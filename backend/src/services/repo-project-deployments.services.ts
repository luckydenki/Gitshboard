import githubDeploymentsClient from "../client/repo-project-deployments.client";
import type { GetRepoProjectDeploymentsData } from "../types/controllers/repo-project";
import RepoProjectDeploymentsProcessor, { type Deployment, type Status } from "../processor/repo-project-deployments.processor";
import CommonError from "../utils/common-error";

const MAX_DEPLOYMENT_PAGES = 10;
const MAX_CONTINUATION_PAGES = 3;

class RepoProjectDeploymentsServices {
    public async getDeployments(
        owner: string,
        repo: string,
        token?: string,
    ): Promise<GetRepoProjectDeploymentsData> {
        const asOf = Date.now();
        const deployments = new Map<string, Deployment>();
        let after: string | null = null;
        let partial = false;
        for (let page = 0; page < MAX_DEPLOYMENT_PAGES; page++) {
            const { repository } = await githubDeploymentsClient.getDeployments({ owner, name: repo, after }, token);
            if (!repository || (!token && repository.visibility !== "PUBLIC")) {
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            }

            const selected = RepoProjectDeploymentsProcessor.selectDeployments(repository.deployments.nodes, asOf);
            for (const item of selected.selected) deployments.set(item.id, item);
            partial = partial || selected.partial;

            const { hasNextPage, endCursor } = repository.deployments.pageInfo;
            if (selected.olderDeploymentFound || !hasNextPage) break;
            if (!endCursor || endCursor === after || page === MAX_DEPLOYMENT_PAGES - 1) {
                partial = true;
                break;
            }
            after = endCursor;
        }

        const records: { deployment: Deployment; timeline: Status[] | null }[] = [];
        for (const deployment of deployments.values()) {
            const timeline = await this.getTimeline(deployment, token);
            records.push({ deployment, timeline });
        }
        const summary = RepoProjectDeploymentsProcessor.summarize(records, asOf);
        return { ...summary, partial: partial || summary.partial };
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
