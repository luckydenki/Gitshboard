import type { GithubGQLGetRepositoryDashboardProfileQuery as GetRepositoryDashboardProfileQuery } from "../github/graphql/operations.generated";

/** 저장소 라우트 상태 확인 데이터입니다. */
export interface GetRepoHealthData {
    message: string;
}

/** 저장소 대시보드 프로필 조회 데이터입니다. */
export interface GetRepoProfileData {
    repository: NonNullable<GetRepositoryDashboardProfileQuery["repository"]>;
}

/** 저장소 활동 종류별 건수입니다. */
export interface RepoActivityCounts {
    commit: number;
    "pull-request": number;
    issue: number;
}

/** 저장소 활동 조회 기간의 현지 날짜 범위입니다. */
interface RepoActivityWindow {
    firstDate: string;
    lastDate: string;
    timezone: string;
}

/** 저장소 활동 이벤트에 공통으로 표시하는 정보입니다. */
interface RepoActivityEventBase {
    id: string;
    title: string;
    url: string;
    actor: string | null;
    reference: string;
    occurredAt: string;
}

/** 저장소 활동 목록에 표시하는 커밋, PR 또는 이슈입니다. */
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

/** 저장소의 최근 활동 목록과 페이지 정보입니다. */
export interface GetRepoActivityData {
    asOf: string;
    window: RepoActivityWindow;
    counts: RepoActivityCounts;
    events: RepoActivityEvent[];
    nextCursor: string | null;
    coverage: {
        truncatedSources: Array<keyof RepoActivityCounts>;
        commitDetailsPartial: boolean;
    };
}

/** 브랜치 선택 목록과 페이지 정보입니다. */
export interface GetRepoActivityBranchesData {
    defaultBranch: string | null;
    branches: string[];
    nextCursor: string | null;
}

/** 선택한 브랜치의 주간 커밋과 저장소 활동이 가장 활발한 날입니다. */
export interface GetRepoActivitySummaryData {
    asOf: string;
    window: RepoActivityWindow;
    branch: string | null;
    counts: RepoActivityCounts;
    dailyCommits: Array<{ date: string; count: number }>;
    peakDay: { date: string; total: number; counts: RepoActivityCounts } | null;
    coverage: {
        truncatedSources: Array<keyof RepoActivityCounts>;
    };
}
