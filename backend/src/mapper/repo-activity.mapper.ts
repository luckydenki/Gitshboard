import type { RepoActivityEvent } from "../types/controllers/repo";
import type { GithubGQLGetRepoActivityQuery } from "../types/github/graphql/operations.generated";

type ActivityRepository = NonNullable<GithubGQLGetRepoActivityQuery["repository"]>;
type ActivityTarget = NonNullable<NonNullable<ActivityRepository["defaultBranchRef"]>["target"]>;
type ActivityCommits = Extract<ActivityTarget, { history: unknown }>["history"];

/** GitHub 활동 응답을 서비스에서 사용하는 이벤트 형태로 변환합니다. */
class RepoActivityMapper {
    /**
     * 한 페이지의 PR을 공통 활동 이벤트로 변환합니다.
     * @param repository GitHub에서 조회한 저장소 활동 데이터.
     **/
    public static toPREvents(repository: ActivityRepository) {
        const prEvents: Array<RepoActivityEvent> = [];

        for (const pr of repository.pullRequests?.nodes ?? []) {
            if (!pr) continue;
            for (const [action, timestamp] of [
                ["opened", pr.createdAt],
                ["merged", pr.mergedAt],
            ] as const) {
                if (!timestamp) continue;
                const occurredAt = new Date(timestamp).toISOString();
                const id = `pull-request:${pr.id}:${action}:${occurredAt}`;
                prEvents.push({
                    id,
                    type: "pull-request",
                    action,
                    title: pr.title,
                    actor: (action === "merged" ? pr.mergedBy : pr.author)?.login ?? null,
                    reference: `#${pr.number}`,
                    url: pr.url,
                    occurredAt,
                    baseBranch: pr.baseRefName,
                    reviewCount: pr.reviews?.totalCount ?? null,
                    checkState: pr.statusCheckRollup?.state ?? null,
                    draft: pr.isDraft,
                });
            }
        }
        return prEvents;
    }

    /**
     * 한 페이지의 이슈를 공통 활동 이벤트로 변환합니다.
     * @param repository GitHub에서 조회한 저장소 활동 데이터.
     **/
    public static toIssueEvents(repository: ActivityRepository) {
        const issueEvents: Array<RepoActivityEvent> = [];
        for (const issue of repository.issues?.nodes ?? []) {
            if (!issue) continue;
            const labels = (issue.labels?.nodes ?? []).flatMap((label) =>
                label ? [label.name] : [],
            );
            for (const [action, timestamp] of [
                ["opened", issue.createdAt],
                ["closed", issue.closedAt],
            ] as const) {
                if (!timestamp) continue;
                const occurredAt = new Date(timestamp).toISOString();
                const id = `issue:${issue.id}:${action}:${occurredAt}`;
                const closer = issue.timelineItems?.nodes?.find(
                    (event) =>
                        event &&
                        "createdAt" in event &&
                        Date.parse(event.createdAt) === Date.parse(timestamp),
                );
                issueEvents.push({
                    id,
                    type: "issue",
                    action,
                    title: issue.title,
                    actor:
                        action === "opened"
                            ? (issue.author?.login ?? null)
                            : closer && "actor" in closer
                              ? (closer.actor?.login ?? null)
                              : null,
                    reference: `#${issue.number}`,
                    url: issue.url,
                    occurredAt,
                    labels,
                    closeReason: action === "closed" ? (issue.stateReason ?? null) : null,
                });
            }
        }
        return issueEvents;
    }

    /**
     * 한 페이지의 커밋을 공통 활동 이벤트로 변환합니다.
     * @param commits GitHub에서 조회한 저장소 활동 데이터.
     **/
    public static toCommitEvents(commits: ActivityCommits | undefined) {
        const commitEvents: Array<RepoActivityEvent> = [];

        for (const commit of commits?.nodes ?? []) {
            if (!commit) continue;
            const occurredAt = new Date(commit.committedDate).toISOString();
            const id = `commit:${commit.oid}:committed:${occurredAt}`;
            commitEvents.push({
                id,
                type: "commit",
                action: "committed",
                title: commit.messageHeadline,
                actor: commit.author?.user?.login ?? commit.author?.name ?? null,
                reference: commit.abbreviatedOid,
                url: commit.url,
                occurredAt,
                sha: commit.oid,
                changedFiles: commit.changedFilesIfAvailable ?? null,
            });
        }

        return commitEvents;
    }

    /**
     * 한 페이지의 커밋, PR, 이슈를 공통 활동 이벤트로 변환합니다.
     * @param repository GitHub에서 조회한 저장소 활동 데이터.
     * @param commits 선택한 브랜치의 커밋 기록.
     * @returns 변환된 활동 이벤트 목록.
     */
    public static toEvents(
        repository: ActivityRepository,
        commits: ActivityCommits | undefined,
    ): RepoActivityEvent[] {
        const commitEvents = this.toCommitEvents(commits);
        const prEvents = this.toPREvents(repository);
        const issueEvents = this.toIssueEvents(repository);

        const events: RepoActivityEvent[] = [...commitEvents, ...prEvents, ...issueEvents];
        events;
        return events;
    }
}

export default RepoActivityMapper;
