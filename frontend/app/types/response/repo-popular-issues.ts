export type RepoPopularIssuesDto = {
    asOf: string;
    status: "complete" | "partial";
    reason: string | null;
    issues:
        | null
        | {
              number: number;
              title: string;
              url: string;
              comments: number;
              reactions: number;
              reactionCounts: Record<string, number>;
              lastActivityAt: string;
              score: number;
          }[];
};
