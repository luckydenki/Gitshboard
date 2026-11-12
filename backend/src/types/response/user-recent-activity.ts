interface RecentActivityItem {
    id: string;
    url: string;
    nameWithOwner: string;
    occurredAt: string; // (derived) 작성일 또는 커밋 시각
}

export type UserRecentActivityItem =
    | (RecentActivityItem & {
          type: "issue" | "pull-request";
          number: number;
          title: string;
          state: "OPEN" | "CLOSED" | "MERGED";
          authorLogin: string | null; // (derived) 작성자 로그인
          commentCount: number; // (derived) 댓글 총계
      })
    | (RecentActivityItem & {
          type: "commit";
          oid: string;
          abbreviatedOid: string;
          messageHeadline: string;
          committedViaWeb: boolean;
      });

export interface GetUserRecentActivityDto {
    items: UserRecentActivityItem[]; // (derived) 최신순으로 합친 공개 활동
}
