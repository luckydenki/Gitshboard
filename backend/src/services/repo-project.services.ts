import client from "../client/repo-project.client";
import history from "./repo-project-history.services";
import deployments from "./repo-project-deployments.services";
import type {
    GetRepoProjectOverviewData, GetRepoProjectFilesData, GetRepoProjectBranchesData,
} from "../types/controllers/repo-project";
import type { GithubGQLGetRepoProjectBranchesQuery } from "../types/github/graphql/operations.generated";
import CommonError from "../utils/common-error";

type ProjectRequest = { owner: unknown; repo: unknown; token?: string };

const healthNames = ["README", "LICENSE", "CONTRIBUTING", "CODE_OF_CONDUCT", "SECURITY"];
const knownTools = new Map([
    ["react", "React"], ["next", "Next.js"], ["vue", "Vue"], ["nuxt", "Nuxt"],
    ["svelte", "Svelte"], ["@angular/core", "Angular"], ["express", "Express"],
    ["vite", "Vite"], ["webpack", "Webpack"], ["rollup", "Rollup"],
    ["@babel/core", "Babel"], ["jest", "Jest"], ["vitest", "Vitest"], ["eslint", "ESLint"],
]);

class RepoProjectServices {
    private location({ owner, repo, token }: ProjectRequest) {
        if (typeof owner !== "string" || !/^[\w-]+$/.test(owner) ||
            typeof repo !== "string" || !/^[\w.-]+$/.test(repo)) {
            throw CommonError.create400Error("저장소 소유자와 이름을 확인해 주세요.");
        }
        return { owner, name: repo, token: token || undefined };
    }

    private async repository(request: ProjectRequest) {
        const { owner, name, token } = this.location(request);
        const { repository } = await client.getOverview({ owner, name }, token);
        if (!repository || (!token && repository.visibility !== "PUBLIC")) {
            throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
        }
        return { repository, token };
    }

    public async getOverview(request: ProjectRequest): Promise<GetRepoProjectOverviewData> {
        const { repository } = await this.repository(request);
        if (repository.diskUsage != null) await history.observeDiskUsage(repository.id, repository.diskUsage, repository.visibility === "PUBLIC");
        const languages = repository.languages?.edges?.flatMap((edge) =>
            edge ? [{ name: edge.node.name, bytes: edge.size }] : [],
        ) ?? [];
        const knownBytes = languages.reduce((sum, item) => sum + item.bytes, 0);
        const totalLanguageBytes = Math.max(knownBytes, repository.languages?.totalSize ?? 0);
        const otherBytes = totalLanguageBytes - knownBytes;
        if (otherBytes > 0) languages.push({ name: "기타", bytes: otherBytes });
        return {
            languages: languages.map((language) => ({
                ...language,
                sharePercent: totalLanguageBytes > 0 ? (language.bytes / totalLanguageBytes) * 100 : null,
            })),
            totalLanguageBytes,
            diskUsageKb: repository.diskUsage ?? null,
            issuePrCounts: {
                openIssues: repository.openIssues.totalCount,
                closedIssues: repository.closedIssues.totalCount,
                openPullRequests: repository.openPullRequests.totalCount,
                mergedPullRequests: repository.mergedPullRequests.totalCount,
            },
        };
    }

    public async getFiles(request: ProjectRequest): Promise<GetRepoProjectFilesData> {
        const { repository, token } = await this.repository(request);
        const target = repository.defaultBranchRef?.target;
        const sha = target && "tree" in target ? target.tree.oid : null;
        const tree = sha ? await client.getTree(repository.owner.login, repository.name, sha, token) : null;
        const entries = tree?.tree.filter((entry) =>
            entry.type === "blob" && entry.path,
        ) ?? [];
        const counts = { source: 0, test: 0, docs: 0, config: 0 };
        const tools = new Map<string, Set<string>>();
        const manifests: { path: string; sha: string }[] = [];
        const addTool = (name: string, path: string) => {
            const paths = tools.get(name) ?? new Set<string>();
            paths.add(path);
            tools.set(name, paths);
        };
        for (const entry of entries) {
            const path = entry.path!;
            if (/(^|\/)(__tests__|tests?|spec)(\/|$)|\.(spec|test)\.[^/]+$/i.test(path)) counts.test++;
            else if (/(^|\/)docs?(\/|$)|\.(md|mdx|rst|adoc)$/i.test(path) ||
                /(^|\/)(license|copying|notice)(\.[^/]*)?$/i.test(path)) counts.docs++;
            else if (/(^|\/)(\.github\/|\.env(?:\.|$)|(?:tsconfig|jsconfig|package)\.|[^/]+\.config\.)|\.(json|ya?ml|toml|lock)$/i.test(path)) counts.config++;
            else counts.source++;

            if (entry.mode !== "120000" && entry.sha && /(^|\/)package\.json$/.test(path)) manifests.push({ path, sha: entry.sha });
            const config = path.split("/").pop() ?? "";
            for (const [key, name] of knownTools) {
                if (config.startsWith(key + ".config.")) addTool(name, path);
            }
            if (config === "yarn.lock") addTool("Yarn", path);
            if (config === "pnpm-lock.yaml") addTool("pnpm", path);
        }

        manifests.sort((left, right) => left.path.split("/").length - right.path.split("/").length ||
            left.path.localeCompare(right.path));
        const selected = manifests.slice(0, 12);
        const details = await Promise.allSettled(selected.map(async ({ sha: blobSha, path }) => {
            const blob = await client.getBlob(repository.owner.login, repository.name, blobSha, token);
            const manifest: unknown = JSON.parse(Buffer.from(blob.content, "base64").toString("utf8"));
            if (!manifest || typeof manifest !== "object") return;
            const packageManager = (manifest as Record<string, unknown>).packageManager;
            if (typeof packageManager === "string") {
                const manager = /^(npm|pnpm|yarn|bun)@/.exec(packageManager)?.[1];
                if (manager) addTool(manager === "yarn" ? "Yarn" : manager, path);
            }
            for (const key of ["dependencies", "devDependencies", "peerDependencies"] as const) {
                const dependencies = (manifest as Record<string, unknown>)[key];
                if (!dependencies || typeof dependencies !== "object") continue;
                for (const dependency of Object.keys(dependencies)) {
                    const name = knownTools.get(dependency);
                    if (name) addTool(name, path);
                }
            }
        }));

        const fileCount = tree?.truncated ? null : entries.length;
        const health = healthNames.map((name) => ({
            name,
            present: entries.some(({ path }) => new RegExp(`^(?:\\.github/|docs/)?${name}(?:\\.[^/]+)?$`, "i").test(path ?? "")),
        }));
        return {
            fileCount,
            fileTypes: (Object.keys(counts) as (keyof typeof counts)[]).map((type) => ({
                type,
                count: counts[type],
                sharePercent: fileCount ? (counts[type] / fileCount) * 100 : null,
            })),
            frameworks: [...tools].sort(([a], [b]) => a.localeCompare(b)).map(([name, paths]) => ({ name, paths: [...paths].sort() })),
            health,
            healthScore: { present: health.filter(({ present }) => present).length, total: health.length },
            partial: Boolean(tree?.truncated) || manifests.length > selected.length || details.some((result) => result.status === "rejected"),
        };
    }

    public async getBranches(request: ProjectRequest): Promise<GetRepoProjectBranchesData> {
        const { owner, name, token } = this.location(request);
        let after: string | null | undefined;
        let partial = false;
        let total = 0;
        let defaultBranch: string | null = null;
        const branches: GetRepoProjectBranchesData["oldest"] = [];
        const observed = new Set<string>();
        for (let page = 0; page < 10; page++) {
            const response: GithubGQLGetRepoProjectBranchesQuery = await client.getBranches({ owner, name, after }, token);
            const repository = response.repository;
            if (!repository || (!token && repository.visibility !== "PUBLIC")) {
                throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
            }
            defaultBranch = repository.defaultBranchRef?.name ?? null;
            const refs = repository.refs;
            total = refs?.totalCount ?? 0;
            for (const ref of refs?.nodes ?? []) {
                if (!ref || observed.has(ref.name)) continue;
                const target = ref.target;
                if (target && "committedDate" in target) {
                    branches.push({ name: ref.name, committedAt: target.committedDate });
                }
                observed.add(ref.name);
            }
            partial = Boolean(refs?.pageInfo.hasNextPage);
            after = refs?.pageInfo.endCursor;
            if (!partial || !after) break;
        }
        const now = Date.now();
        const daysOld = (committedAt: string) => (now - Date.parse(committedAt)) / 86_400_000;
        const staleBranches = branches.filter(({ committedAt }) => daysOld(committedAt) >= 180);
        return {
            defaultBranch,
            total,
            active: branches.filter(({ committedAt }) => daysOld(committedAt) <= 30).length,
            stale: staleBranches.length,
            oldest: staleBranches.sort((a, b) => a.committedAt.localeCompare(b.committedAt)).slice(0, 2),
            partial: partial || branches.length < total,
        };
    }

    public async getHistory(request: ProjectRequest) {
        const { owner, name, token } = this.location(request);
        return history.getHistory(owner, name, token);
    }

    public async getParticipation(request: ProjectRequest) {
        const { owner, name, token } = this.location(request);
        return history.getParticipation(owner, name, token);
    }

    public async getDeployments(request: ProjectRequest) {
        const { owner, name, token } = this.location(request);
        return deployments.getDeployments(owner, name, token);
    }
}

export default new RepoProjectServices();
