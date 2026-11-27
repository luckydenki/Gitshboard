/** 인기 Issue 단독 조회 응답. 수집이 불완전하면 결과를 표시하지 않습니다. */
export type GetRepoPopularIssuesData = {
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
