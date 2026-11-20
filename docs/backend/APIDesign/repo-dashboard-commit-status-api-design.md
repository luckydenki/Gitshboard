# 저장소 대시보드 커밋 현황 API 설계

대상: `frontend/app/components/page/repo-dashboard/menus/RepoDashboardCommitStatusSection.tsx`. 이 문서는 설계다. API·UI 구현은 포함하지 않는다.

## 확정된 기간·집계 규칙

- 조회 대상은 조회 시점의 기본 브랜치 HEAD에서 도달 가능한 커밋이다. **병합 커밋을 포함**한다.
- 기본 집계 범위는 `asOf`를 기준으로 거슬러 올라간 **완료된 이동 1년**이다. `year` 선택 파라미터는 두지 않는다. 조회 시각 자체가 아니라 요청 `timezone`의 날짜를 기준으로 기간을 정하고 **진행 중인 오늘은 제외**한다.
- 모든 집계 기간의 시작은 시작일 **00:00**, 끝은 종료일 **23:59분 전체**다. API 필터는 `[시작일 00:00, 종료일 다음 날 00:00)`으로 표현한다. 이 방식은 23:59:59와 소수 초를 모두 포함한다. 종료일은 가장 최근에 완료된 날인 **어제**다. `asOf`는 기준 날짜와 스냅샷을 결정하는 시각이며, 실제 집계 상한은 오늘 00:00이다.
- `n`일 이동 기간은 **어제를 마지막 날로 세어 총 `n`개 완료된 날짜**를 포함한다. 따라서 시작은 `asOf`의 현지 날짜에서 `n`일 전인 날의 00:00이다. 최근 7일은 7일 전, 30일은 30일 전, 90일은 90일 전부터 어제 끝까지다. 1년의 윤년 처리 방식은 후속 기준표에서 확정한다.
- **주간 통계**의 시작은 위 이동 기간 시작일이 속한 주의 **월요일 00:00**이다. **월간 통계**가 추가되면 이동 기간 시작일이 속한 달의 **1일 00:00**이다. 주·월 시계열은 이동 기간의 시작보다 앞선 날짜를 포함할 수 있으므로 이동 기간 총합과 시계열 점의 합을 동일한 값으로 취급하지 않는다. 각 지표의 실제 범위를 반환한다.
- 전체 기간 조회는 명시적 `scope=all`일 때만 허용한다. 기본 화면의 “전체 기간”은 “최근 1년”으로 바꿔야 한다.
- 코드 변화량 그래프는 **주별 순증감**(`additions - deletions`)이다. 각 점의 호버 정보에는 해당 주의 추가·삭제 줄 수를 각각 제공한다. 아래 퍼센트바는 동일 집계 기간의 총 추가·삭제 줄 수 비율이다. 분모가 0이면 비율은 `null`이다.

## 필요한 GitHub 데이터

| 화면 데이터 | 분류 | 수집·계산 |
| --- | --- | --- |
| 최근 1년 커밋 수, 주별 커밋, 최다 주, 연속 활동 주 | 직접/단순 계산 | 기본 브랜치 GraphQL `Commit.history`를 이동 기간 및 주간 확장 구간으로 페이지 수집해 집계한다. |
| 최근 7/30/90일 커밋 수와 직전 동등 기간 비교, 최근 1년과 이전 1년 비교 | 단순 계산 | 각각 실제 `from/to`로 이력을 조회한다. 이전 기간 수가 0이면 변화율은 `null`. |
| 주별 코드 순증감, 총 추가·삭제·비율 | 단순 계산 | GraphQL 각 `Commit.additions/deletions`를 주별 집계한다. 그래프 점마다 추가·삭제 값을 보존한다. |
| 최근 90일 시간대별 커밋·피크·12~20시 비율 | 단순 계산 | `committedDate`를 요청 시간대로 변환해 4시간 버킷 6개로 집계한다. |
| 최근 1년 활동일·활동 주·평균·마지막 커밋·최장 무커밋·연속 활동 주 | 단순 계산 | 기본 이동 기간 이력에서 계산한다. 전체 기간은 별도 명시 요청과 비동기 캐시가 필요하다. |
| 카드 설명 문구 | 표시 규칙 | API는 수치·기간을 반환하고 프론트가 문구와 포맷을 만든다. |

REST `stats/commit_activity`·`stats/code_frequency`는 병합 커밋을 제외하므로 이번 계약의 집계값으로 쓰지 않는다. `stats/punch_card`는 기간 필터와 요청 시간대 조건이 맞지 않는다. [GitHub REST 통계](https://docs.github.com/en/rest/metrics/statistics).

| 용도 | REST 최소 호출 | GraphQL 최소 점수·호출 |
| --- | --- | --- |
| 기본 브랜치 HEAD | 저장소 조회 1회 | `repository.defaultBranchRef.target` 1점·1회 |
| 이동 1년과 주간 확장 구간 이력 | `commits?sha=<HEAD>&since=<from>&until=<to>&per_page=100` 최소 `ceil(N/100)`회 | `history(since,until,first:100,after)` 최소 `ceil(N/100)`회, 통상 회당 1점 이상 |
| 주별 추가·삭제 | 목록 조회 외에 REST 커밋 상세 `N`회 | 같은 GraphQL 이력에서 `additions/deletions` 선택. 추가 페이지 호출 없음 |
| 이전 동등 기간 비교 | 이전 기간 목록 최소 `ceil(P/100)`회 | 이전 기간 이력 최소 `ceil(P/100)`회, 통상 회당 1점 이상 |
| 명시적 전체 기간 전적 | 전체 목록 최소 `ceil(A/100)`회 | 전체 `history` 최소 `ceil(A/100)`회, 통상 회당 1점 이상 |

`N/P/A`는 각 범위의 커밋 수다. 빈 범위에도 확인 호출이 필요하다. GraphQL 점수는 단순 단일 connection의 추정 하한이며 실제 `rateLimit.cost`, 노드·시간 제한으로 확인한다. 비공개 저장소 커밋 이력에는 `Contents: read`가 필요하다. [GraphQL Commit 필드](https://docs.github.com/en/graphql/reference/commits), [GraphQL 비용](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api), [REST 커밋 목록](https://docs.github.com/en/rest/commits/commits).

## 서버 API 계약

기존 `/api/repos/:owner/:repo` 아래 두 GET을 둔다. 성공은 `CommonResponse<T>`, 실패는 `CommonErrorResponse`다. 본문은 없다. `owner/repo`는 비어 있지 않은 GitHub 경로 세그먼트로 검증하고 슬래시·제어 문자·과도한 길이를 거부한다. `timezone`은 유효한 IANA 이름만 허용하며 기본값은 `Asia/Seoul`이다. `year` 파라미터는 없다.

### GET `/api/repos/:owner/:repo/commit-status/overview`

쿼리: `timezone`(선택). 서버는 `asOf`와 기본 브랜치 HEAD SHA를 한 번 고정한다. 기간별 `from/to`는 요청 시간대에서 계산한 반열린 구간이다. 완료된 기간에서는 `effectiveTo = to`이며 `to`는 오늘 00:00 또는 그 이전이다.

```ts
type DataStatus = "complete" | "pending" | "partial" | "unavailable";
type Metric<T> = { status: DataStatus; value: T | null; reason?: string; coveredFrom?: string; coveredTo?: string };
type Period = { from: string; to: string; effectiveTo: string };
type GetRepoCommitStatusOverviewData = {
  asOf: string; timezone: string; branch: string | null; headSha: string | null;
  basis: { scope: "default_branch_history"; includeMerges: true };
  rollingYear: Period;
  weekly: Metric<{ period: Period; points: { from: string; to: string; count: number }[] }>;
  yearly: Metric<{ period: Period; count: number; previousPeriod: Period; previousCount: number; changePercent: number | null }>;
  periods: Metric<{ days: 7 | 30 | 90; period: Period; count: number; previousPeriod: Period; previousCount: number; changePercent: number | null }[]>;
  codeChange: Metric<{ period: Period; granularity: "week"; points: { from: string; to: string; additions: number; deletions: number; net: number }[]; additions: number; deletions: number; net: number; additionsPercent: number | null; deletionsPercent: number | null }>;
  timeOfDay: Metric<{ period: Period; buckets: { startHour: 0 | 4 | 8 | 12 | 16 | 20; count: number }[]; peakStartHour: number | null; middayPercent: number | null }>;
};
```

### GET `/api/repos/:owner/:repo/commit-status/records`

쿼리: `timezone`(선택), `scope`(`rolling_year` 기본값 또는 명시적 `all`). 전체 기간 수집은 비동기로 처리할 수 있다.

```ts
type GetRepoCommitStatusRecordsData = {
  asOf: string; timezone: string; scope: "rolling_year" | "all"; period: Period | null;
  branch: string | null; headSha: string | null;
  totalCommits: Metric<number>;
  activeDays: Metric<{ count: number; totalDays: number; percentage: number | null }>;
  activeWeeks: Metric<number>;
  avgCommitsPerActiveWeek: Metric<number>;
  avgCommitsPerActiveDay: Metric<number>;
  busiestWeek: Metric<{ from: string; to: string; count: number } | null>;
  lastCommit: Metric<{ sha: string; committedAt: string } | null>;
  longestInactiveDays: Metric<{ days: number; from: string; to: string } | null>;
  longestActiveWeeks: Metric<{ weeks: number; ongoing: boolean }>;
};
```

빈 저장소는 `branch/headSha: null`, 계산 가능한 값은 0, 존재하지 않는 마지막 커밋은 `null`이다. 빈 결과는 `complete`, 수집 중은 `pending`, 일부 페이지만 확인되면 `partial`, 계산 불가는 `unavailable`과 `reason`으로 구분한다. 부분 수집 수치를 전체 값처럼 표시하지 않도록 `value: null`을 기본으로 한다.

오류: 400 경로·시간대·범위 오류, 401 로그인 필요, 403 권한 부족, 404 저장소 없음(비공개 은닉 포함), 429 GitHub 속도 제한, 502 GitHub 응답 실패, 503 수집 서비스 일시 불가. 집계 중에는 지표별 `pending`과 `retryAfter`를 제공한다.

## 후속 기준표에서 확정할 세부 사항

- 이동 1년의 정확한 날짜 수와 2월 29일을 지나는 경우의 시작일. 최근 7/30/90일은 오늘을 제외하고 어제까지의 각각 7/30/90개 완료된 날짜다.
- 요청 시간대의 일광절약시간제 전환일 처리.
- 주간 시계열의 마지막 주가 아직 진행 중이면 어제까지의 부분 주로 표시할지, 완료된 주만 표시할지.
