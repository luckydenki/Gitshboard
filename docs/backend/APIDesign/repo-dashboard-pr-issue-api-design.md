# 저장소 대시보드 Issue·PR API 설계

대상: `frontend/app/routes/repo-dashboard/RepoDashboardPullRequestIssueSection.tsx`. 이 문서는 구현된 데이터 계약과 집계 기준을 설명한다.

## 집계 원칙

- 기본 기간은 요청 시간대의 오늘 00:00을 제외한 최근 28일 `[from, to)`이다. 주간 추이는 이 기간을 앞에서부터 7일씩 네 구간으로 나눈다. 현재 상태 지표는 `asOf` 시점의 열린 항목 전체를 대상으로 한다. 전체 누적 상태 수는 기간과 별개다.
- 기간 지표의 생성·종료·병합 대상은 각각 해당 시각이 기간에 속한 항목이다. 종료는 현재 닫힌 항목의 `closedAt` 기준이며, 과거 재오픈을 포함한 실제 종료 이벤트 수가 아니다. 시간은 초 단위, 비율은 0~100 숫자로 전달한다. 분모가 0이면 비율은 `null`이다. 중앙값과 P90은 정렬한 관측값에서 각각 중간값(짝수는 가운데 두 값 평균)과 nearest-rank P90을 사용한다.
- 연결 지표는 PR의 `closingIssuesReferences`가 반환하는 현재 연결만 뜻한다. 이것은 병합 시 실제 자동 종료된 이력이나 임의의 언급 전체를 뜻하지 않는다. `asOf`는 수집 시작 시각이며 GitHub가 트랜잭션 스냅샷을 보장하지 않으므로 수집 중 변경은 발생할 수 있다.

## 화면 데이터와 분류

| 화면 | 분류 | 데이터 및 기준 |
| --- | --- | --- |
| 열린·닫힌·전체 Issue, 열린·병합·미병합 종료 PR | 직접/사칙연산 | 각 상태 수; 미병합 종료 = 닫힌 PR 중 mergedAt이 없는 수 |
| Issue 신규·종료 추이, 처리율, 순증감 | 단순 집계 | 생성·현재 종료 시각으로 각 주를 집계; 처리율은 종료/신규이며 100%를 초과할 수 있다 |
| 열린 Issue 경과일, 라벨, 담당자 없음, good first issue, 댓글 분포 | 직접/단순 집계 | 현재 열린 Issue의 생성시각·라벨·담당자·댓글 수. 라벨은 중복 포함이므로 합이 100%를 넘을 수 있다. 라벨명은 대소문자 무시 정확히 일치 |
| 인기 Issue | 규칙 기반 (사용자 지정) | 열린 Issue의 댓글·8종 반응과 마지막 활동 시각으로 점수를 계산하여 상위 5개를 표시한다. |
| 마일스톤 | 직접/단순 집계 | 열린 마일스톤의 열린·닫힌 Issue 수, 닫힘/(열림+닫힘). 종료 예정일 오름차순 최대 5개 |
| Issue 종료 소요, 유형별 소요 | 단순 집계 | 기간에 닫힌 현재 닫힌 Issue의 생성~종료. 유형은 GitHub Issue type을 그대로 사용하고 미지정도 포함 |
| PR 결과·첫 리뷰·병합 속도·크기·변경 파일·협업 규모 | 직접/단순 집계 | 기간 생성 PR 코호트. 첫 제출 리뷰, 병합시각, additions+deletions, changedFiles, 리뷰·댓글·참여자 수. 리뷰 없는 PR은 첫 리뷰 통계에서 제외하고 표본 수 공개 |
| Draft·봇 PR | 직접/단순 집계 | 현재 열린 PR의 isDraft, 기간 생성 PR 작성자의 GitHub Bot 타입. 봇 타입이 불명인 경우 별도 unknown |
| Issue와 연결된 PR | 직접/단순 집계 | 기간 생성 PR 중 현재 종료 참조가 있는 PR 수. 다른 저장소 참조 포함 여부와 확인 범위 표시 |
| 전체 기간 종료 사유 | 직접 | GitHub stateReason의 completed, not_planned, duplicate, null을 그대로 표시. 현재 UI의 무효·재현 불가는 원본에서 구별할 수 없다 |
| 첫 유지관리자 응답, 재오픈, 변경 요청 후 수정, 승인 없이 병합, 외부 기여자, Dependabot 처리 | 규칙/이력 수집 | 유지관리자 정의, 이벤트 시점, 승인 유효성 및 외부 기여자 정의가 필요하다. 1차 계약에서 제외 |
| 코드와 테스트·문서 동시 변경, 병합 방식, 병합으로 실제 자동 종료된 Issue | 규칙/이력 수집 | 경로 분류나 커밋·타임라인 해석이 필요하거나 원본만으로 확정할 수 없다. 1차 계약에서 제외 |

## GitHub 조회와 비용

`I`, `P`, `M`은 각 조회 대상 Issue, PR, 마일스톤 수다. 빈 결과도 확인 호출이 한 번 필요하다. 페이지 크기 100을 전제로 하며 데이터 변경으로 페이지 수가 달라질 수 있다. 아래는 전체 정확 집계에 필요한 하한이며 속도 제한, 중첩 페이지 및 재시도로 더 늘어난다.

| 대상 | REST 호출 하한 | GraphQL 호출·점수 하한 및 인자 | 권한 |
| --- | --- | --- | --- |
| Issue 목록·댓글 수·상태 | `GET /repos/{owner}/{repo}/issues?state=all&per_page=100&page=…` 최소 `max(1,ceil((I+목록에 섞인 PR)/100))`; PR 식별 후 제외 | `repository(owner,name){issues(first:100,after:…){nodes{createdAt closedAt state stateReason updatedAt comments{totalCount} assignees{totalCount} issueType{name}} pageInfo{hasNextPage endCursor}}}` 상태별 최소 `max(1,ceil(I/100))`회, 각 호출 최소 1점 | Issues: read |
| 라벨 | Issue 목록 응답에 포함되는 라벨도 페이지 제한 여부를 확인; 누락 시 `issues/{number}/labels` 페이지 추가 | Issue별 `labels(first:100,after:…)` 중첩 connection. 한 페이지 초과 Issue는 별도 페이지 요청 필요. 중첩 connection 수에 따라 점수 증가 | Issues: read |
| PR 목록·상세 | `pulls?state=all&per_page=100&page=…` 최소 `max(1,ceil(P/100))`회 + additions, deletions, changed_files 등 상세 `P`회 | `pullRequests(first:100,after:…,states:[OPEN,CLOSED,MERGED])`에서 필드를 함께 선택, 최소 `max(1,ceil(P/100))`회, 각 호출 최소 1점 | Pull requests: read |
| 첫 리뷰·리뷰 수 | `pulls/{number}/reviews?per_page=100&page=…` PR별 최소 1회, 100개 초과 추가 페이지 | PR별 `reviews(first:100,after:…)`와 `totalCount`; 최초 제출 리뷰를 확인할 수 있도록 전체를 페이지 처리. 중첩 요청 수에 따라 점수 증가 | Pull requests: read |
| Issue 연결 | 각 Issue timeline의 cross-reference를 페이지 수집해야 하므로 PR별 직접 참조를 반환하는 GraphQL보다 비용과 의미가 다름 | `closingIssuesReferences(first:100,after:…)` PR별 페이지 수집. 최소 목록 호출에 중첩 가능, 누락 페이지는 추가 요청 | Issues 및 Pull requests: read; 교차 저장소는 해당 저장소 접근 필요 |
| 반응 및 마지막 활동 | 열린 Issue마다 `issues/{number}/reactions?per_page=100&page=…` 최소 1회, 100개 초과 시 추가 페이지 | `reactions(first:100,after:…)`을 Issue마다 페이지 수집해 createdAt을 확인. `first:1`·생성 시각 내림차순과 반응 그룹별 총계로 최신 시각과 전체 반응을 함께 조회. 중첩 연결 비용 및 노드 제한 적용 | Issues: read |
| 협업 댓글·리뷰 작성자 | 대상 PR마다 `issues/{number}/comments`, `pulls/{number}/comments`, `pulls/{number}/reviews`를 각각 페이지 수집. 각 PR당 최소 3회 | 각 PR의 comments, reviews, reviewThreads 및 각 thread의 comments와 작성자를 페이지 수집; 모든 중첩 페이지 확인 필요 | Issues 또는 Pull requests: read (일반 댓글), Pull requests: read (리뷰·리뷰 댓글) |
| 마일스톤 | `milestones?state=open&per_page=100&page=…` 최소 `max(1,ceil(M/100))`회 | `milestones(first:100,states:OPEN,after:…)` 최소 `max(1,ceil(M/100))`회, 각 호출 최소 1점 | Issues: read |

정확한 GraphQL 비용은 쿼리 구조 및 중첩 connection에 따라 달라진다. 실제 `rateLimit.cost`와 응답 헤더로 측정하며 위 1점은 하한이지 전체 비용 견적이 아니다. GitHub의 노드·시간 제한과 100개 페이지 한도를 지키고, 이력 전체 수집이 크면 응답에서 부분 수집을 표시한다. [GraphQL 제한](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api), [Issue REST](https://docs.github.com/en/rest/issues/issues), [PR REST](https://docs.github.com/en/rest/pulls/pulls), [GraphQL PR 필드](https://docs.github.com/en/graphql/reference/pulls), [GraphQL Issue 필드](https://docs.github.com/en/graphql/reference/issues).

## 서버 계약

| 메서드와 경로 | 응답 데이터 |
| --- | --- |
| `GET /api/repos/:owner/:repo/pr-issue/issues` | `GetRepoIssueStatsData`의 Issue 집계와 마일스톤 |
| `GET /api/repos/:owner/:repo/pr-issue/pull-requests` | `GetRepoPullRequestStatsData`의 PR 상태 수, 처리 결과, 리뷰, 병합, 크기, Draft, 봇, 협업, 연결 |
| `GET /api/repos/:owner/:repo/pr-issue/popular` | `GetRepoPopularIssuesData`의 인기 Issue 순위, 반응별 집계, 마지막 활동 시각 |

각 엔드포인트는 본문 없이 호출하고, 성공 시 `CommonResponse<T>`, 오류 시 `CommonErrorResponse`를 반환한다. 두 종합 조회의 선택 쿼리 `timezone`은 IANA 시간대이며 기본값은 `Asia/Seoul`이다. 인기 순위는 실제 경과 일수로 계산하므로 시간대 쿼리를 받지 않는다. 자세한 응답 타입은 `backend/src/types/controllers/repo-pr-issue.ts` 및 `repo-popular-issues.ts`를 참고한다.

`complete`의 빈 배열 및 0은 실제 빈 결과다. 분모가 0이거나 표본이 없는 값은 `null`이다. `partial`은 제한 또는 중첩 페이지 누락, `unavailable`은 조회할 수 없는 지표이며 두 상태 모두 집계값을 반환하지 않는다. 조회 전체 실패는 잘못된 요청 400, GitHub 인증 401, 권한 403, 저장소 404, 호출 제한 429, 서비스 일시 오류 503으로 구별한다. 인증 미들웨어 오류는 기존 규약에 따라 500을 반환할 수 있다.

## 논의로 확정한 기준

- 인기 Issue는 열린 Issue 중 점수 상위 5개다. `P = 0.6 × 댓글 수 + 0.4 × 반응 수`, `점수 = P^0.8 / (T + 2)^1.2`이며 `T`는 마지막 활동 이후 실수 일수다. 반응 수는 Issue 본문에 달린 8종 반응의 합이다. 반응 종류는 개별 보존한다. 동점은 반응 수 내림차순, 댓글 수 내림차순, 번호 오름차순이다.
- 마지막 활동은 적어도 Issue의 `updatedAt`과 Issue 본문 반응의 생성 시각을 확인해 가장 최근인 시각으로 정의한다. `updatedAt`만으로 모든 반응이 반영된다고 가정하지 않는다. 반응 목록을 전부 수집할 수 없으면 인기 순위는 `partial`, 값은 null이다. 반응 삭제 등 GitHub가 제공하지 않는 과거 활동의 시각은 복원할 수 없다.
- 마일스톤은 열린 마일스톤 중 5개를 표시한다. 정렬은 종료 예정일이 빠른 순, 예정일이 없으면 뒤, 동률이면 번호 오름차순이다.
- 종료 사유는 전체 기간에 현재 닫혀 있는 Issue의 stateReason을 집계한다. 주별 신규·종료 추이는 최근 완료 28일이다.
- PR 협업 규모에서 GitHub가 Bot으로 식별한 작성자의 리뷰·일반 댓글·코드 리뷰 댓글을 제외한다. 일반 댓글과 코드 리뷰 댓글을 합하여 댓글 수로 집계하고, 리뷰 제출 건수는 별도 집계한다. 사람으로 표시되는 machine user는 식별하지 못할 수 있다. 참여자는 PR 작성자, 리뷰 작성자, 두 종류 댓글 작성자를 중복 제거해 센다. 작성자 정보가 없는 경우 사람으로 추정하지 않고 부분 수집으로 표시한다.
- 기간 코호트와 현재 상태를 구분해 UI의 설명을 변경하고, 제외 지표는 목업 수치를 실제 값처럼 표시하지 않는다.

인기 점수와 마지막 활동은 사용자 지정 규칙 기반 지표이며 단순 집계만을 대상으로 하는 기존 API 설계 분류의 명시적 예외다. 반응 및 협업 작성자의 식별에는 항목별 페이지 조회가 추가로 필요하고, 모든 페이지가 완료되기 전에는 전체 결과로 표시할 수 없다.
## 수집 방식과 한계

- 토큰이 있으면 순수 Issue 목록, 인기 Issue의 반응 집계와 가장 최근 반응, PR 상태 수 및 종료 참조에 GraphQL을 사용한다. PR의 상세·일반 댓글·코드 리뷰 댓글·제출 리뷰와 마일스톤은 REST로 수집한다. 토큰 없이 조회하는 경우 Issue 목록·반응과 PR 상태 수도 REST로 수집한다. 종료 참조는 이 저장소에 속한 Issue만 센다. GraphQL을 호출할 토큰이 없으면 연결 지표는 `unavailable`이다.
- 일부 조회만 실패하면 다른 지표의 정상 결과를 함께 표시한다. 기간 밖 PR은 상세 조회하지 않는다. PR 상세 조회는 한 번에 최대 5개씩 진행한다.
- 목록당 최대 60페이지, 중첩 목록당 최대 10페이지와 요청별 수집을 최대 40초 동안 진행한다. 이미 시작한 요청의 응답 시간은 추가될 수 있다. 이 한도를 넘으면 해당 지표를 `partial`로 표시한다. 실시간 API의 정확한 값이 필요한 경우, 상한을 넘는 대형 저장소는 전체 이력을 저장하는 별도 수집 작업이 필요하다.
- 토큰이 있으면 최근 반응과 유형별 총계를 Issue 페이지에 포함해 Issue마다 반응 목록을 요청할 필요가 없다. REST 대체 경로는 댓글·반응 수로 만들 수 있는 최대 점수가 현재 5위보다 낮을 때 상세 조회를 생략한다. 무반응 Issue는 반응 페이지를 조회하지 않는다. 반응 수가 목록의 합계와 다르면 완전한 순위를 반환하지 않는다.
- 공개 조회용 토큰으로 조회할 때는 저장소의 공개 여부를 확인한다. 아이템별 접근 제한 때문에 집계할 수 없는 값은 화면에서 해당 사유를 표시한다.
- 기존 화면의 목업 중 GitHub에서 근거를 확보할 수 없거나 추가 정의가 필요한 지표는 앞의 분류표대로 표시 범위에서 제외한다.

워크트리 프론트엔드는 기본 API 서버 포트 3000을 사용한다. 여러 워크트리를 함께 실행하는 경우 `GITSHBOARD_DEV_API_TARGET`을 지정해 해당 워크트리 백엔드와 연결할 수 있다.
