import CommonError from "../utils/common-error";
import githubRepoCommitStatusClient from "../client/repo-commit-status.client";
import { CommitStatusCommit } from "../processor/repo-commit-status.processor";

export interface RepoSnapshot {
    a: (
        token: string | undefined,
        MAX_PAGES: number,
        {
            owner,
            name,
            since,
            until,
            asOf,
            timezone,
            today,
        }: {
            owner: string;
            name: string;
            since?: string;
            until: string;
            asOf: string;
            timezone: string;
            today: string;
        },
    ) => Promise<Snapshot>;
}

type Snapshot = {
    asOf: string;
    timezone: string;
    today: string;
    branch: string | null;
    headSha: string | null;
    commits: CommitStatusCommit[];
    complete: boolean;
};

export const SnapshotCursorFirst = async (
    token: string | undefined,
    MAX_PAGES: number,
    {
        owner,
        name,
        since,
        until,
        asOf,
        timezone,
        today,
    }: {
        owner: string;
        name: string;
        since?: string;
        until: string;
        asOf: string;
        timezone: string;
        today: string;
    },
) => {
    const commits: CommitStatusCommit[] = [];
    let after: string | null = null;
    let branch: string | null = null;
    let headSha: string | null = null;
    let complete = false;
    let missingNode = false;

    const cursors: Array<string | null> = [null];
    for (let page = 0; page < MAX_PAGES; page++) {
        const cursor = await githubRepoCommitStatusClient.getCursor(
            {
                name,
                owner,
                after,
                since,
                until,
            },
            token,
        );

        const target = cursor.repository?.defaultBranchRef?.target;
        if (target && "history" in target) {
            const pageinfo = target.history.pageInfo;
            if (!pageinfo.hasNextPage || !pageinfo.endCursor) {
                break;
            } else {
                cursors.push(pageinfo.endCursor);
                after = pageinfo.endCursor;
            }
        }
    }

    const settledResponse = await Promise.allSettled(
        cursors.map((e) => {
            console.log(" cursor ", e);
            return githubRepoCommitStatusClient.getPage({
                name,
                owner,
                since,
                until,
                after: e,
            });
        }),
    );

    for (let i = 0; i < settledResponse.length; ++i) {
        const res = settledResponse[i];
        if (res.status === "fulfilled") {
            const ref = res.value.repository?.defaultBranchRef;
            const target = ref?.target;

            //history가 애초에 없이 보내지는 경우
            if (!ref || !target || !("history" in target)) {
                return {
                    asOf,
                    timezone,
                    today,
                    branch: null,
                    headSha: null,
                    commits: [],
                    complete: true,
                };
            }
            //headSha?
            if (headSha && headSha !== target.oid) {
                return { asOf, timezone, today, branch, headSha, commits, complete: false };
            }
            branch = ref.name;
            headSha = target.oid;

            target.history.nodes?.forEach((e) => {
                if (!e) return;
                commits.push({
                    committedAt: e?.committedDate,
                    deletions: e?.deletions,
                    additions: e?.additions,
                    sha: e?.oid,
                });
            });
        }
    }
    console.log("commit ", commits);
    complete = true;
    return { asOf, timezone, today, branch, headSha, commits, complete };
};

export const SnapshotNormal = async (
    token: string | undefined,
    MAX_PAGES: number,
    {
        owner,
        name,
        since,
        until,
        asOf,
        timezone,
        today,
    }: {
        owner: string;
        name: string;
        since?: string;
        until: string;
        asOf: string;
        timezone: string;
        today: string;
    },
): Promise<Snapshot> => {
    const commits: CommitStatusCommit[] = [];
    let after: string | null = null;
    let branch: string | null = null;
    let headSha: string | null = null;
    let complete = false;
    let missingNode = false;

    //TODO : N+1 쿼리 문제 해결 필요
    for (let page = 0; page < MAX_PAGES; page++) {
        const response = await githubRepoCommitStatusClient.getPage(
            {
                owner,
                name,
                since,
                until,
                after,
            },
            token,
        );
        const repository = response.repository;

        if (!repository || (!token && repository.visibility !== "PUBLIC")) {
            throw CommonError.create404Error("저장소를 찾을 수 없습니다.");
        }
        const ref = repository.defaultBranchRef;
        const target = ref?.target;
        if (!ref || !target || !("history" in target)) {
            return {
                asOf,
                timezone,
                today,
                branch: null,
                headSha: null,
                commits: [],
                complete: true,
            };
        }
        if (headSha && headSha !== target.oid) {
            return { asOf, timezone, today, branch, headSha, commits, complete: false };
        }
        branch = ref.name;
        headSha = target.oid;
        const history = target.history;
        if (!history.nodes || history.nodes.some((node) => !node)) missingNode = true;
        for (const node of history.nodes ?? []) {
            if (!node) continue;
            commits.push({
                sha: node.oid,
                committedAt: node.committedDate,
                additions: node.additions,
                deletions: node.deletions,
            });
        }
        //다음 페이지가 없는 경우
        if (!history.pageInfo.hasNextPage) {
            complete = !missingNode;
            break;
        }
        const cursor = history.pageInfo.endCursor;
        //커서가 더 이상 없거나 그 위치에 머무르는 경우
        if (!cursor || cursor === after) break;
        after = cursor;
    }
    return { asOf, timezone, today, branch, headSha, commits, complete };
};
