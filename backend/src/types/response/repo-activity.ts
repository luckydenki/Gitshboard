export interface RepoActivityCounts {
    commit: number;
    "pull-request": number;
    issue: number;
}

interface RepoActivityEventBase {
    id: string;
    title: string;
    url: string;
    actor: string | null;
    reference: string;
    occurredAt: string;
}

export type RepoActivityEvent =
    | (RepoActivityEventBase & {
          type: "commit";
          action: "committed";
          sha: string;
          changedFiles: number | null;
          representativePath?: string;
      })
    | (RepoActivityEventBase & {
          type: "pull-request";
          action: "opened" | "merged";
          baseBranch: string;
          reviewCount: number | null;
          checkState: string | null;
          draft: boolean;
      })
    | (RepoActivityEventBase & {
          type: "issue";
          action: "opened" | "closed";
          labels: string[];
          closeReason: string | null;
      });

export interface GetRepoActivityDto {
    asOf: string;
    window: { firstDate: string; lastDate: string; timezone: string }; // (derived)
    counts: RepoActivityCounts; // (derived)
    events: RepoActivityEvent[]; // (derived)
    nextCursor: string | null; // (derived)
    coverage: {
        truncatedSources: Array<keyof RepoActivityCounts>;
        commitDetailsPartial: boolean;
    }; // (derived)
}
