import GithubRepoProjectHistoryClient from "../client/repo-project-history.client";
import snapshotRepository from "../repository/repo-project-snapshot.repository";
import type {
    GetRepoProjectHistoryData,
    GetRepoProjectParticipationData,
} from "../types/controllers/repo-project";
import CommonError from "../utils/common-error";
import RepoProjectHistoryProcessor, { type HistoryMonth } from "../processor/repo-project-history.processor";

const PAGE_LIMIT = 15;

function hasNextPage(link?: string): boolean {
    return Boolean(link?.includes('rel="next"'));
}

class RepoProjectHistoryServices {
    private async getAuthorizedRepository(client: GithubRepoProjectHistoryClient, owner: string, repo: string, token?: string) {
        const metadata = await client.getRepository(owner, repo);
        if (!token && metadata.visibility !== "public") {
            throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
        }
        return metadata;
    }

    /** 권한을 확인한 저장소의 이번 UTC 월 첫 Git 용량 관측값을 저장합니다. */
    public observeDiskUsage(repoId: string, diskUsageKb: number, isPublic = false) {
        if (!repoId || !Number.isFinite(diskUsageKb) || diskUsageKb < 0) return Promise.resolve();
        const month = new Date().toISOString().slice(0, 7);
        return snapshotRepository.recordDiskUsage(repoId, isPublic, month, diskUsageKb);
    }

    public async getHistory(owner: string, repo: string, token?: string): Promise<GetRepoProjectHistoryData> {
        const client = new GithubRepoProjectHistoryClient(token);
        const metadata = await this.getAuthorizedRepository(client, owner, repo, token);
        const months = RepoProjectHistoryProcessor.completedMonths(new Date());
        const isPublic = metadata.visibility === "public";
        await this.observeDiskUsage(metadata.node_id, metadata.size, isPublic);
        const canonicalOwner = metadata.owner.login;
        const canonicalRepo = metadata.name;
        const [current, observedDisk] = await Promise.all([
            client.listCommits({
                owner: canonicalOwner, repo: canonicalRepo, sha: metadata.default_branch, per_page: 1,
            }),
            snapshotRepository.readDiskUsage(metadata.node_id, isPublic, months.map(({ month }) => month)),
        ]);

        const headSha = current?.data[0]?.sha;
        const createdAt = Date.parse(metadata.created_at ?? "");
        const treeCounts = new Map<string, Promise<number | null>>();

        const results = await Promise.all(months.map(async ({ month, end }, index) => {
            const diskUsageKb = observedDisk[index];
            if (createdAt >= end) return { month, fileCount: null, diskUsageKb };
            if (!headSha) return { month, fileCount: 0, diskUsageKb };

            const history = await client.listCommits({
                owner: canonicalOwner, repo: canonicalRepo, sha: headSha,
                until: new Date(end - 1000).toISOString(), per_page: 1,
            });
            const treeSha = history?.data[0]?.commit.tree.sha;
            if (!treeSha) return { month, fileCount: 0, diskUsageKb };

            let fileCount = treeCounts.get(treeSha);
            if (!fileCount) {
                fileCount = client.getTree(canonicalOwner, canonicalRepo, treeSha).then((tree) =>
                    tree.truncated ? null : tree.tree.filter((entry) => entry.type === "blob").length,
                );
                treeCounts.set(treeSha, fileCount);
            }
            return { month, fileCount: await fileCount, diskUsageKb };
        }));
        return RepoProjectHistoryProcessor.summarizeHistory(results);
    }

    public async getParticipation(owner: string, repo: string, token?: string): Promise<GetRepoProjectParticipationData> {
        const client = new GithubRepoProjectHistoryClient(token);
        const metadata = await this.getAuthorizedRepository(client, owner, repo, token);
        const months = RepoProjectHistoryProcessor.completedMonths(new Date());
        const canonicalOwner = metadata.owner.login;
        const canonicalRepo = metadata.name;

        const [workItems, commits] = await Promise.all([
            this.getWorkItemAuthors(client, canonicalOwner, canonicalRepo, months),
            this.getCommitAuthors(client, canonicalOwner, canonicalRepo, metadata.default_branch, months[5].end),
        ]);

        const createdAt = Date.parse(metadata.created_at ?? "");
        return RepoProjectHistoryProcessor.summarizeParticipation(months, createdAt, workItems, commits);
    }

    private async getWorkItemAuthors(
        client: GithubRepoProjectHistoryClient, owner: string, repo: string, months: HistoryMonth[],
    ) {
        let authors = {
            issueAuthors: months.map(() => new Set<number>()),
            prAuthors: months.map(() => new Set<number>()),
            oldest: Number.POSITIVE_INFINITY,
        };
        for (let page = 1; page <= PAGE_LIMIT; page++) {
            const response = await client.listWorkItems(owner, repo, page);
            authors = RepoProjectHistoryProcessor.collectWorkItemAuthors(authors, response.data, months);
            if (!hasNextPage(response.headers.link) || authors.oldest < months[0].start) {
                return { ...authors, complete: true };
            }
        }
        return { ...authors, complete: false };
    }

    private async getCommitAuthors(
        client: GithubRepoProjectHistoryClient, owner: string, repo: string, branch: string, end: number,
    ) {
        let firstCommitByAuthor = new Map<number, number>();
        const current = await client.listCommits({ owner, repo, sha: branch, per_page: 1 });
        const sha = current?.data[0]?.sha;
        if (!sha) return { firstCommitByAuthor, complete: true };

        for (let page = 1; page <= PAGE_LIMIT; page++) {
            const response = await client.listCommits({
                owner, repo, sha, until: new Date(end - 1000).toISOString(), page, per_page: 100,
            });
            if (response) firstCommitByAuthor = RepoProjectHistoryProcessor.collectCommitAuthors(firstCommitByAuthor, response.data);
            if (!response || !hasNextPage(response.headers.link)) return { firstCommitByAuthor, complete: true };
        }
        return { firstCommitByAuthor, complete: false };
    }
}

export default new RepoProjectHistoryServices();
