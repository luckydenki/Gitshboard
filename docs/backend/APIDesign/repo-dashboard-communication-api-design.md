# 저장소 대시보드 Communication API 설계

대상: `frontend/app/routes/repo-dashboard/RepoDashboardCommunicationSection.tsx` 및 `frontend/app/mock/repo-dashboard/communication.ts`.
설계일: 2026-11-23. 설계 제안이며 API나 화면 구현은 포함하지 않는다.

## 화면 데이터 전수 분류

A는 GitHub 직접 제공, B는 단순 통계·사칙연산, C는 규칙·의미 판정·대규모 이력 수집이 필요한 데이터다. C는 이번 API 구현 범위에서 제외하되 해당 UI는 유지한다. mock 값을 실제 값으로 반환하지 않으며, UI의 예시 데이터 표시는 실제 통계와 구별한다.

| 화면·mock 필드                                       | 분류             | 필요한 원본·판정                                                                                                                                |
| ---------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 상위 기여자 `contributors.login/commits`             | B                | 기본 브랜치의 오늘 제외 직전 7일 커밋을 author.id별 집계. 커밋 수 내림차순 상위 4명                                                             |
| `contributors.share`, `summary.contributorTotal`     | B                | 기간 내 익명 포함 고유 커밋 수를 분모로 비율 계산. 총수는 식별된 기여 계정 수                                                                   |
| good first issue, help wanted 건수                   | B                | 현재 열린 Issue의 정확한 라벨명 일치 건수, PR 제외                                                                                              |
| 신규 기여자 PR 병합률                                | C                | 신규·첫 PR 정의와 저장소 전체 PR 작성자 이력 필요. FIRST_TIME_CONTRIBUTOR만으로 최초 PR을 보장하지 않음                                         |
| 첫 PR 유지관리자 리뷰 댓글 평균                      | C                | 최초 PR 식별, 유지관리자 및 댓글 종류·권한 시점 정의 필요                                                                                       |
| 외부 기여자 6개월 내 재참여율                        | C                | 외부·기여·재참여 정의, 6개월 관찰이 끝난 코호트 및 전체 이력 필요                                                                               |
| 작게 시작할 수 있는 Issue 비율                       | C                | 작업 범위 판정 규칙 필요. good first issue와 동일시하지 않음                                                                                    |
| Issue 담당자 명시 비율                               | B                | 열린 Issue 중 assignees.totalCount > 0 비율                                                                                                     |
| 예상 난이도·재현 절차 명시 비율                      | C                | 표준 필드 없음. 라벨·Issue form·본문 파싱 기준 필요                                                                                             |
| `readinessInsight` 세 정보 모두 명확 비율            | C                | 위 세 조건의 교집합. 개별 비율의 곱으로 계산 불가                                                                                               |
| 최근 첫 기여 PR 제목·작성자·번호·리뷰 댓글·병합 시간 | C                | 제목 등은 직접 제공되지만 '첫 기여' 선택에 전체 PR 이력 필요. 선정 후 title, author, number, url, createdAt, mergedAt, 리뷰 댓글 원본 사용 가능 |
| `firstContributionDescription`                       | C                | PR 본문·diff 의미 요약 필요                                                                                                                     |
| `difficulty/Insight/Evidence`                        | C                | 난이도 등급과 AI 요약 정책 필요. 이번 계약에 생성 결과 없음                                                                                     |
| Discussion 전체 수·카테고리 이름/수/비율             | A/B              | categories의 id/name, discussions의 category.id 및 전체 수                                                                                      |
| 답변 완료율 `answeredRate`                           | B                | 답변 채택 가능 카테고리의 Discussion 중 현재 answer != null 비율                                                                                |
| 첫 답변 중앙값 `firstAnswerTime`                     | 제외             | 사용자 결정으로 지표 및 API 응답에서 제외                                                                                                       |
| `resolvedDiscussions`, `resolvedPeriod`              | C                | 'Issue로 옮기지 않고 해결'은 답변 채택과 다름. 채택 여부만으로 미전환을 보장할 수 없음                                                          |
| 인기 Discussion 제목·카테고리·답글                   | 사용자 지정 규칙 | 추천 수·최근 활동·고유 댓글 참여자 수와 생성 후 경과 시간으로 계산. 아래 공식 참조                                                              |
| 반복 질문·주제와 횟수                                | C                | 최근 90일 제목/본문 의미 군집·중복 판정 필요                                                                                                    |
| 공지 수·월평균                                       | 제외             | 사용자 결정으로 제공 범위에서 제외                                                                                                              |
| 릴리스 소식 수·월평균                                | A/B              | 실제 GitHub Release의 publishedAt 기준 건수 및 월평균                                                                                           |
| 기간 안내·단위·참조 문자열                           | 표시             | 기간 메타데이터와 숫자로 프론트에서 구성. '총 N명', %, 시간 문장을 서버에서 포맷하지 않음                                                       |

## 집계 기준 제안

- 기여자는 UTC 오늘 제외 직전 7일 `[from,to)`이다. 현재 열린 Issue는 현재 상태, Discussion 카테고리는 전체 기간이다.
- 응답 통계·인기 목록: 수집 시작 시각 `asOf`까지 최근 90일 생성 Discussion `[from,to)`. 기간과 모집단을 응답에 포함한다.
- 릴리스: `asOf`에서 UTC 기준 6개월 전(해당 월에 같은 날짜가 없으면 말일)부터 `[from,to)`, `publishedAt` 기준, draft 제외, prerelease 포함. 월평균 = 건수 / 6. 태그 수가 아니다.
- 답변 완료율은 현재 카테고리의 isAnswerable 기준, 미답변 포함 분모다. 첫 답변 중앙값과 관련 표본·시간 필드는 제공하지 않는다.
- 인기 순위는 아래 사용자 지정 시간 감쇠 공식을 따른다. 최근 활동은 오늘을 제외한 직전 7일의 작성자별 활동일 수로 집계한다. 상위 3건 제안과 최근 90일 생성 후보 범위는 유지하며, 동률 정렬은 별도 확정이 필요하다.
- 비율은 0~100 숫자, 시간은 초, 시각은 UTC ISO 8601. 분모 0과 표본 없음은 null. 숫자 0은 실제 0건에만 사용한다.
- 기여자는 기본 브랜치 이력에서 commit.committer.date가 기간에 속한 커밋의 주 작성자 author.id로 집계한다. SHA 중복을 제거하고 봇·merge commit도 포함한다. 공동 작성자 별도 분배는 하지 않는다. 익명 커밋은 비율 분모에만 포함하며 이름·이메일을 반환하지 않는다. totalEntries는 식별된 계정 수이며 전체 기여자 수가 아니다.
- 기여 순위는 커밋 수 내림차순, 동률 login 오름차순으로 상위 4명을 표시한다. 기간은 응답 contributors.value.period에 제공한다. 모든 브랜치 기여나 실제 사람 수를 의미하지 않는다.

## GitHub 조회·최소 비용·권한

`page(X)=max(1,ceil(X/100))`. 다음은 캐시 미스·재시도 없음·전체 정확 수집의 하한이다. GraphQL 각 요청은 최소 1점이며 HTTP 1회와 1점은 동일하지 않다.

| 대상                                | REST: 인자와 최소 호출                                                                                                                                                                                        | GraphQL: 인자·필드와 최소 점수                                                                                                                                                                                                                                                                                           | 최소 저장소 권한  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| 기여자                              | `GET /repos/{owner}/{repo}/commits?since=…&until=…&per_page=100&page=…`: 최근 7일 커밋 K건에 `page(K)`회. 시작 경계 포함을 위해 since는 from 1초 전, until은 to 1초 전을 요청하고 서버에서 `[from,to)` 재검증 | 대안은 기본 브랜치 commit history(since,until)의 author를 전체 페이지 수집하여 집계. 이번 구현은 REST 사용                                                                                                                                                                                                               | Contents: read    |
| 열린 Issue 라벨·담당자              | `GET /repos/{owner}/{repo}/issues?state=open&per_page=100&page=…`: `page(I+Popen)`회, pull_request 있는 항목 제외, assignees·labels 사용                                                                      | `repository(owner,name).issues(states:[OPEN],first:100,after)`에서 `assignees{totalCount}`, `labels(first:100){nodes{name} pageInfo{…}}`: `page(I)`회, 각 최소 1점. 라벨 중첩 초과 페이지 추가                                                                                                                           | Issues: read      |
| Discussion 전체 분포·기간 응답·인기 | 동일 기능의 공식 REST 목록 API 없음                                                                                                                                                                           | `discussionCategories(first:100,after)`와 `discussions(first:100,after,orderBy:{field:CREATED_AT,direction:DESC})`에서 `id number title url createdAt category{id name isAnswerable} answer{id} comments{totalCount}`. 전체 D건 `page(D)`회, 카테고리 목록은 첫 요청에 합칠 수 있어 추가 HTTP 최소 0회. 각 요청 최소 1점 | Discussions: read |
| 실제 릴리스                         | `GET /repos/{owner}/{repo}/releases?per_page=100&page=…`: 전체 R건 `page(R)`회. draft·published_at으로 필터                                                                                                   | `releases(first:100,after){nodes{isDraft isPrerelease publishedAt} pageInfo{…}}`: `page(R)`회, 각 최소 1점                                                                                                                                                                                                               | Contents: read    |

공통 REST path 인자 owner/repo, GraphQL repository 인자 owner/name 필수. 커서마다 pageInfo를 확인한다. Discussions 전체 분포가 필요하므로 최근 90일 이전에서 수집을 중단하지 않는다. 릴리스 목록의 생성 순서와 publishedAt 순서를 동일시하지 않고 전체를 확인한다. Issue 라벨은 소문자 변환 후 `good first issue`, `help wanted` 정확 일치로 각각 카운트하며 중복 Issue는 각 항목에 포함된다.

권장 방식은 기여자 REST + 나머지 GraphQL이다. 서로 독립적인 첫 Issue·Discussion·Release 페이지를 한 쿼리에 합칠 수 있지만 노드·시간 제한을 우선한다. C/I/D/R이 모두 100 이내이고 라벨 중첩 초과가 없으면 REST 1회 + GraphQL 1회(최소 1점)가 이론상 하한이다. 항상 2회로 완료된다는 보장이 아니다.

GraphQL 점수는 공식 계산법에 따라 connection을 채우는 내부 요청 수 합계/100을 반올림하고 최소 1점을 적용한 예상치다. 페이지별 쿼리 형태가 결정된 뒤 산출하고 `rateLimit { cost remaining resetAt }`로 실측한다. 예를 들어 Issue 100개의 labels(first:100)는 중첩 연결 비용을 추가한다. 노드 최대 500,000, connection first/last 1~100과 타임아웃 제한을 지킨다.

공개 REST 읽기는 익명 접근이 가능한 endpoint에 한해 토큰 없이 가능하다. GraphQL은 인증이 필요하다. 위 권한은 GitHub App/세분화 토큰의 저장소별 읽기 권한이며 OAuth private 저장소는 repo 범위 및 SSO·설치 접근 승인이 필요하다. 권한이 있어도 저장소 접근을 보장하지 않는다.

## 백엔드 API 계약 제안

모두 GET, body 없음. 공통 prefix `/api/repos/:owner/:repo/communication`. 성공은 기존 `CommonResponse<T>`의 `data`, 실패는 기존 `CommonErrorResponse`를 사용한다. 구현 타입은 `backend/src/types/controllers/repo-communication.ts`에 명시적으로 정의하는 것을 제안한다.

| 경로            | 쿼리 | data 타입·필드                                                                                   |
| --------------- | ---- | ------------------------------------------------------------------------------------------------ |
| `/contributors` | 없음 | `GetRepoCommunicationContributorsData`: `contributors`                                           |
| `/onboarding`   | 없음 | `GetRepoCommunicationOnboardingData`: `openIssues`, `excludedMetrics`                            |
| `/discussions`  | 없음 | `GetRepoCommunicationDiscussionsData`: `distribution`, `responses`, `popular`, `excludedMetrics` |
| `/releases`     | 없음 | `GetRepoCommunicationReleasesData`: `releases`                                                   |

집계 범위와 캐시 특성이 달라 네 개로 분리한다. 신규 기여자·AI 분석 API는 이번에 개설하지 않는다. 쿼리 없는 고정 기간 설계이므로 timezone/from/to/limit 등 알 수 없는 쿼리는 400으로 거절한다. URL은 디코딩 1회 후 owner 1~39자의 영숫자/하이픈(양끝 하이픈·연속 하이픈 금지), repo 1~100자의 영숫자/점/밑줄/하이픈을 허용하며 `.`/`..`, 슬래시, 제어문자는 거절한다. 저장소 존재·가시성은 GitHub가 최종 확인한다.

모든 data에 `asOf`, `fetchedAt`, 지표별 아래 wrapper를 포함한다. GitHub는 트랜잭션 스냅샷을 제공하지 않아 asOf는 수집 시작 시각이다.

```ts
type Metric<T> = {
  status: "complete" | "partial" | "unavailable";
  value: T | null;
  reason:
    | null
    | "collection_limit"
    | "upstream_partial"
    | "forbidden"
    | "disabled"
    | "definition_required"
    | "upstream_unavailable";
  coverage: {
    collected: number;
    total: number | null;
    hasNextPage: boolean | null;
  };
  period: { from: string; to: string } | null;
};
```

- `contributors: Metric<{ period: { from: string; to: string }; totalEntries: number; top: { login: string; avatarUrl: string; url: string; commits: number; sharePercent: number | null }[] }>`. 기간 커밋 페이지가 모두 모이지 않으면 순위·비율·계정 수를 반환하지 않는다.
- `openIssues: Metric<{ total: number; goodFirstIssueCount: number; helpWantedCount: number; assignedCount: number; assignedPercent: number | null }>`.
- `distribution: Metric<{ total: number; categories: { id: string; name: string; count: number; percent: number | null }[] }>`. 0건인 카테고리도 포함한다.
- `responses: Metric<{ answerableCount: number; answeredCount: number; answeredPercent: number | null }>`.
- `popular: Metric<{ number: number; title: string; url: string; categoryId: string; categoryName: string; topLevelCommentCount: number }[]>`.
- `releases: Metric<{ count: number; monthlyAverage: number; months: 6; includePrereleases: true }>`.
- `excludedMetrics: { key: string; reason: "definition_required" }[]`는 onboarding의 신규 PR 병합률·리뷰 평균·재참여·작은 Issue·난이도·재현 절차·안내 교집합·첫 기여·AI 난이도, discussions의 Issue 미전환 해결·반복 주제를 열거한다. 첫 답변 중앙값과 공지사항은 별도의 제외 결정이므로 이 목록에도 포함하지 않는다. 정의가 필요한 데이터를 0이나 빈 배열로 대체하지 않는다.

위 타입 표기는 설계용이며 원본 GitHub 응답 타입을 수기로 구현하라는 뜻이 아니다. REST 원본은 Octokit, GraphQL 원본은 이름 있는 operation과 Codegen 타입을 따른다.

## 빈 결과·실패·부분 수집

- complete + 0/[]는 실제 빈 결과다. complete의 내부 비율 null은 분모가 없음을 뜻한다.
- partial은 수집 상한·중첩 페이지 미수집·GraphQL 일부 필드 오류. 해당 metric.value는 null로 두고 coverage만 제공한다. 일부 목록으로 전체 순위·비율을 계산하지 않는다. 정상인 다른 지표는 유지한다.
- unavailable/forbidden은 확인된 권한 부족, unavailable/disabled는 hasDiscussionsEnabled=false를 확인한 경우다. 필드 null이나 빈 목록만으로 비활성화라고 판단하지 않는다.
- 전체 요청 실패: 400 입력 오류, 401 인증 없음·만료, 403 확인된 접근 거부, 404 저장소 없음 또는 접근 불가로 GitHub가 숨김, 429 primary/secondary 제한, 502 잘못된 upstream 응답, 503 GitHub 일시 실패·타임아웃. 한글 오류 메시지를 사용한다. rate limit의 403/429는 제한 헤더·오류 원인을 확인하고 429로 매핑한다.
- 일부 지표만 실패하면 HTTP 200과 지표별 상태를 사용한다. 모두 실패하면 위 오류를 반환한다. 접근 불가와 빈 저장소를 동일 응답으로 처리하지 않는다.
- 캐시를 도입한다면 저장소와 인증 접근 범위를 키에 포함하고 반환 전에 현재 접근을 확인한다. 설계 시점에는 실제 GitHub 호출 및 비용을 측정하지 않았으며, 구현 후 호출 결과는 아래 구현 현황에 기록했다.

## 사용자 결정 및 남은 확인 사항

- 첫 답변 중앙값은 지표와 API 계약에서 제외한다.
- 릴리스 소식은 실제 GitHub Release로 확정한다. 공지사항은 제공 범위에서 제외한다.
- C 항목은 구현하지 않으며 해당 UI는 삭제하지 않는다. 이번 변경은 설계 문서만 수정하며 화면 코드는 수정하지 않는다.
- 인기 지표의 공통 형태와 Discussion 가중치는 아래 사용자 지정 공식으로 변경한다. 기존 댓글 수 단독 정렬 제안은 폐기한다. 이 명시적 사용자 지정 규칙은 일반 C 항목 구현 제외와 구분하며, 미확정 정의를 확인한 후 구현할 수 있다. 이번 작업은 설계만 수행한다.

## Discussion 인기 지표 추가 조사

GitHub 공식 Discussion GraphQL 스키마에서 다음 후보를 확인했다.

| 후보                | GitHub 필드                                                | 의미·제약                                                                                     |
| ------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 추천 수             | `upvoteCount`                                              | 게시물에 대한 명시적인 추천. 댓글을 작성하지 않는 이용자의 관심도 반영 가능                   |
| 본문 반응 수        | `reactions { totalCount }`                                 | 이모지 반응 전체 수. 긍정·부정 반응이 함께 있으므로 호감도로 해석하지 않음                    |
| 본문 반응 종류별 수 | `reactionGroups { content users { totalCount } }`          | 좋아요·하트·웃음 등 종류별 분포. 특정 반응 가중치는 별도의 규칙 결정 필요                     |
| 대댓글 수           | `comments(first:100) { nodes { replies { totalCount } } }` | 최상위 댓글을 전부 페이지 처리한 뒤 replies.totalCount를 합산. comments.totalCount와 구별     |
| 고유 댓글 참여자 수 | 댓글·대댓글의 `author.id`                                  | 전체 댓글·답글 페이지를 수집하고 작성자를 중복 제거해야 함. 삭제된 사용자 등은 별도 처리 필요 |
| 최근 활동 참고      | `updatedAt`                                                | 편집 등도 포함하므로 최근 댓글·반응이 발생한 시각과 동일하지 않음                             |
| 조회수              | 해당 공개 `Discussion` 필드 없음                           | 공식 공개 GraphQL API에서 게시물별 조회수를 얻을 수 없어 이번 계약에 사용하지 않음            |

추가 조회 후보는 `upvoteCount reactions { totalCount } reactionGroups { content users { totalCount } }`다. 추천과 반응 집계는 기존 Discussion 페이지에 함께 요청할 수 있어 별도 HTTP 호출 없이 수집 가능하다. 단, GraphQL connection 구조가 달라지므로 점수는 rateLimit.cost로 재확인한다. 댓글 작성자·대댓글까지 모으는 방식은 추가 페이지와 노드 비용이 발생한다.

본문 반응 수와 종류별 분포는 조사 후보이며 현재 지정된 평가 점수에는 포함하지 않는다. 추천 수와 반응 수를 합쳐 고유 참여자 수로 표시하지 않는다.

위 값들은 현재 누적치다. '최근 90일 생성된 글의 현재 인기'와 '최근 90일 동안 발생한 참여'는 다르며, 후자를 계산하려면 반응 시각·댓글 이력 또는 주기적 스냅샷이 추가로 필요하다. 사용자 지정 인기 공식은 다음 절을 따른다.

## 사용자 지정 인기 점수

모든 인기 지표의 공통 형태는 `score = evaluationScore^A / (elapsedTime + 2)^B`이며 `A <= 1`, `B > 1`이다. 다른 화면의 기존 설계·코드는 이번 문서 변경에서 수정하지 않는다.

Discussion에는 다음 값을 지정한다.

```text
evaluationScore = 0.7 * ln(1 + upvoteCount)
                + 0.2 * ln(1 + recentActivity)
                + 0.1 * ln(1 + uniqueCommenterCount)
score = evaluationScore^0.9 / (elapsedTime + 2)^1.2
elapsedTime = UTC 날짜(asOf) - UTC 날짜(createdAt)  // 정수 일수
```

- 시간 기준은 최초 생성일이며 시·분·초와 소수점은 제외한다. 서비스 전체에서 UTC 날짜 차이를 사용한다는 설계안으로 통일한다. 같은 UTC 날짜는 0일, 다음 UTC 날짜는 1일이다. 이는 24시간 경과량을 내림하는 방식과 구별된다.
- `recentActivity`는 UTC 기준 오늘 00:00을 to, 그보다 7일 전 00:00을 from으로 하는 `[from,to)` 구간이다. 오늘을 전부 제외하고 어제까지 7개 날짜를 포함한다. UTC 기준 오늘이 2026-11-23이면 2026-11-16 00:00:00Z 이상, 2026-11-23 00:00:00Z 미만이다.
- 해당 구간의 댓글·대댓글을 합쳐 `(author.id, UTC 생성 날짜)`별 최대 1회만 인정한다. 게시글 작성자·GitHub Bot 타입·author=null은 제외한다. 한 사람이 7일 모두 작성하면 최대 7회다. 추천·반응·수정은 포함하지 않으며 updatedAt 대신 댓글·대댓글 createdAt을 사용한다.
- `uniqueCommenterCount`는 최상위 댓글과 대댓글의 author.id를 중복 제거한 수다. 게시글 작성자와 GitHub Bot 타입은 제외한다. author가 null인 삭제·확인 불가 계정은 식별할 수 없으므로 수에 포함하지 않고 제외 건수를 메타데이터로 공개한다. Bot 타입 외 일반 계정 자동화 여부는 임의로 추정하지 않는다.
- 반복 작성의 영향을 줄이기 위해 작성자별 하루 상한과 자연로그 ln(1+x)를 적용한다. 별도 정규화는 추가하지 않는다. 따라서 0.7/0.2/0.1이 실제 점수 기여 비중 70%/20%/10%를 보장하지 않는다.
- 추천 수와 고유 댓글 참여자 수 수집을 필수로 추가한다. 댓글·대댓글의 author.id와 pageInfo를 전체 페이지 처리해야 하므로 기존 Discussion 목록만 조회하는 최소 호출·점수는 인기 수집 비용 전체를 나타내지 않는다. 최근 활동은 댓글·대댓글의 createdAt을 함께 조회해 계산한다. 별도 활동 connection은 필요하지 않으나 각 댓글·대댓글의 전체 페이지 수집 비용은 추가 산정해야 한다.
- 인기 응답은 기존 표시 필드에 `upvoteCount`, `recentActivity`, `uniqueCommenterCount`, `evaluationScore`, `score`, `createdAt`을 추가하는 방향이다. 집계 기간 `activityPeriod: { from: string; to: string }`와 `elapsedDays`도 제공한다.
- 필수 댓글·답글 페이지가 누락되면 인기 metric은 partial/value=null로 반환하고 불완전한 참여자 수로 순위를 만들지 않는다.

### 최근 활동 데이터의 조회 가능 범위

통합된 '최근 활동 건수' 필드는 없다. 종류별 connection과 시각을 가져와 기간별 집계를 수행해야 한다.

| 활동             | 개별 데이터·시각                                                    | 최근 기간 집계 가능 범위                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 최상위 댓글 작성 | `comments.nodes { id createdAt author { id __typename } }`          | 현재 조회 가능한 댓글의 createdAt으로 집계 가능                                                                                                                        |
| 대댓글 작성      | 각 댓글의 `replies.nodes { id createdAt author { id __typename } }` | 댓글과 별도로 페이지 수집 후 집계 가능                                                                                                                                 |
| 이모지 반응      | 본문·댓글·답글의 `reactions.nodes { id createdAt content }`         | 현재 남아 있는 반응의 생성 시각 기준 집계 가능. 삭제한 반응의 과거 이벤트까지 복원할 수 없음                                                                           |
| 추천             | `upvoteCount`                                                       | 현재 추천 총수만 제공. 개별 추천·추천 발생 시각 목록이 없어 최근 기간의 실제 추천 이벤트 수는 직접 집계 불가                                                           |
| 수정             | `updatedAt`, `lastEditedAt`, `userContentEdits`                     | 최신 수정 시각과 조회 가능한 콘텐츠 편집 이력은 별개다. updatedAt 하나로 수정 횟수나 댓글·추천 등의 전체 활동 건수를 구할 수 없음. 이력의 접근·삭제 상태를 확인해야 함 |
| 답변 채택        | `answerChosenAt`, 현재 `answer`                                     | 현재 채택 상태의 시각은 조회 가능. 채택·해제 반복 전체 이벤트 이력을 뜻하지 않음                                                                                       |

추천 수를 주기적으로 저장해 차이를 구할 수는 있지만 추천 취소가 반영된 순증감이며 실제 신규 추천 건수와 다르다. 현재 남은 댓글·반응으로 산출한 기간 수치 역시 삭제된 과거 활동을 포함한 완전한 이벤트 이력이 아니다.

최근 활동은 위에서 확정한 오늘 제외 직전 7일의 댓글·대댓글 작성자별 활동일 수를 사용한다. 고유 참여자 계산을 위해 가져오는 createdAt을 재사용한다. 수정·추천·반응은 이 건수에 포함하지 않는다.

## 공식 근거

- [Repository contributors 및 집계 한계](https://docs.github.com/en/rest/repos/repos#list-repository-contributors)
- [Issue REST 목록과 PR 혼재](https://docs.github.com/en/rest/issues/issues#list-repository-issues)
- [Discussions GraphQL 조회](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions)
- [Discussion·카테고리·댓글 필드](https://docs.github.com/en/graphql/reference/discussions)
- [Releases REST·권한](https://docs.github.com/en/rest/releases/releases#list-releases)
- [GraphQL 비용·노드·요청 제한](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api)

- [Reaction 생성 시각](https://docs.github.com/en/graphql/reference/reactions#reaction)

## 구현 현황

- 구현 브랜치: `codex/communication-api`. 네 GET 엔드포인트를 구현하고 useQuery(staleTime 5분, retry 3회)로 연결했다.
- 최종 구현 응답 필드는 `backend/src/types/controllers/repo-communication.ts`가 기준이다. 초기 계약의 coverage, fetchedAt, excludedMetrics는 현재 응답에 포함하지 않는다. C 항목은 API를 호출하지 않는 기존 예시 UI로 유지한다.
- 기여자·열린 Issue·Release는 Octokit REST 페이지를 수집한다. Discussion은 Codegen GraphQL을 사용한다. 각 목록 최대 60페이지, 요청별 수집 예산 40초를 적용한다. 부분 목록으로 전체 집계나 순위를 반환하지 않는다.
- 인기 후보는 최근 90일 생성 게시물, 동점은 게시물 번호 내림차순이다. 댓글이 없으면 댓글 조회를 생략하며 대댓글 totalCount가 0이면 대댓글 조회도 생략한다.
- 최근 활동은 UTC 오늘 제외 직전 7일, 작성자별 하루 최대 1회다. 댓글·대댓글의 전체 고유 참여자와 추천 수에 ln(1+x)를 적용하고 생성 후 정수 UTC 날짜 차이로 감쇠한다.
- 신규 API·컴포넌트의 변경 내용과 테스트는 추가했으며 빌드는 실행하지 않았다. 사용자가 npm run build만 금지라고 명확히 한 뒤 Chromium Storybook 테스트 6개와 백엔드 테스트 8개가 통과했다. 수동 시각 점검은 미실행이다.

- 로컬 백엔드에서 `octocat/Hello-World` 대상으로 네 엔드포인트를 실제 호출하여 모두 HTTP 200을 확인했다. contributors/releases는 complete, onboarding은 수집 상한에 따른 partial/value=null, discussions는 비활성화에 따른 unavailable/disabled로 반환됐다. 이 검증이 대규모 목록 전체 수집 성공이나 활성 Discussion의 실제 순위 정확성까지 보장하지는 않는다.

- 원래 디자인을 유지하도록 화면 연결을 수정했다. good first issue/help wanted 개별 카드, Issue 안내의 담당자 막대, Discussion 카테고리·답변·인기 카드의 기존 너비와 배치를 복원했다. C 항목은 원래 위치에 유지하고 첫 답변 중앙값·공지사항의 명시적인 제외 결정만 유지한다. 실제 페이지 시각 확인과 원래 카드 위치에 대한 Storybook 회귀 검사를 완료했다.

- 기여자 순위를 전체 기간에서 오늘 제외 UTC 직전 7일로 변경했다. 전체 contributors 조회를 기간 지정 commits 조회로 교체했고 화면 문구도 갱신했다. 커밋 없는 주는 complete/빈 배열이며, 빈 Git 저장소의 명시적 empty 409도 같은 상태로 처리한다. 조회 권한은 Metadata:read에서 Contents:read로 변경된다.
