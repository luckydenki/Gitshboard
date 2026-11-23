import type GithubRepoPrIssueClient from "../client/repo-pr-issue.client";
import type { RestPull } from "../types/github/rest/repo-pr-issue";

async function collectPull(client: GithubRepoPrIssueClient, pull: RestPull) {
    return {
        pull,
        results: await Promise.allSettled([
            client.pull(pull.number),
            client.reviews(pull.number),
            client.conversation(pull.number),
            client.reviewComments(pull.number),
            client.closingIssues(pull.number),
        ] as const),
    };
}
export type CollectedPullDetails = Awaited<ReturnType<typeof collectPull>>;

/** 상세 PR 요청을 5개 단위로 시작하고 제한 시간 이후 새 묶음을 시작하지 않습니다. */
export async function collectPullDetails(
    client: GithubRepoPrIssueClient,
    cohort: readonly RestPull[],
    deadline: number,
) {
    const rows: CollectedPullDetails[] = [];
    for (let offset = 0; offset < cohort.length && Date.now() < deadline; offset += 5) {
        const batch = cohort.slice(offset, offset + 5);
        rows.push(...(await Promise.all(batch.map((pull) => collectPull(client, pull)))));
    }
    return rows;
}
