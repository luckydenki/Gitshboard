# 사용자 개발 성향 API 설계 및 연동

대상: `/user/:user/devStyle`. 상단 언어·관심사·시간·요일 및 하단 작업 목적·협업 패널.

## 화면 데이터와 분류

| 화면 | 분류 | 원천 및 정의 |
| --- | --- | --- |
| 언어 Top 5 | b, 합산·비율 | 최근 push 순 공개 소유 저장소 최대 30개의 언어 바이트 합 / 모든 수집 언어 바이트. fork 제외. 기여자의 작성량 아님 |
| 관심 기술 Top 3 | b, 빈도 | 같은 저장소의 topics를 저장소 수로 합산. 실제 관심사에 대한 판단이 아닌 참고 지표 |
| 0~23시·월~일 활동 | b, 집계 | 최근 30일 최대 300개 공개 이벤트 중 PushEvent, PullRequestEvent, IssuesEvent, PullRequestReviewEvent의 created_at. 커밋 수가 아닌 이벤트 수 |
| PR 작성·리뷰·외부 저장소 | b, 집계 | PR opened 이벤트, 리뷰 이벤트, 집계 이벤트 중 타인 소유 저장소 distinct 수. 리뷰 고유 ID 수 또는 전체 기여량이 아님 |
| 작업 목적 분류 및 성향 문장 | c | GitHub 표준 필드 없음. 제목·라벨 추정 규칙/AI 필요. 이번 구현은 unsupported를 명시하고 목업 수치 제거 |
| 저장소명·토픽·이벤트 날짜 | a | GitHub 원본 필드 |

언어·토픽은 조회 시점의 저장소 스냅샷이며 활동 분석 기간과 다름. 시간대 기본 Asia/Seoul. 비공개 활동 미포함.

## REST / GraphQL 비교

| 데이터 | REST 인자·최소 호출 | GraphQL 대안·예상 최소 점수 |
| --- | --- | --- |
| 저장소+토픽 | users/{login}/repos, type=owner, sort=pushed, per_page=31: 1회 | user(login).repositories(first:31, ownerAffiliations:OWNER, privacy:PUBLIC), repositoryTopics(first:100): 최소 1점 추정 |
| 언어 | repos/{owner}/{repo}/languages: 비어 있지 않은 저장소 N개면 N회 | 위 repositories.languages(first:100).edges.size/node.name/color: 저장소와 통합 가능. 31개 연결 기준 대략 1점 이상, 언어/토픽 추가 페이지 별도 |
| 이벤트 시각과 협업 표본 | users/{login}/events/public, per_page=100, page=1~3: 1~3회 | 동일 공개 이벤트 스트림 API 없음. contributionsCollection은 별도 기여 정의이며 timestamp 분포 전체와 동등하지 않음. PR·리뷰 노드 개별 페이지를 조회하면 최소 페이지당 1점, 커밋은 저장소 history 추가 비용 |

채택: REST. 공통 표본에서 활동·협업을 동시에 만들며 저장소도 제한된 범위로 조회. 최소 2회(저장소 없음/이벤트 1페이지), 최대 34회(목록 1+언어 30+이벤트 3). 순차 요청으로 폭주 방지, GitHub 요청별 15초 timeout. 전체 기간 이력 수집은 하지 않음.
GraphQL 점수는 공식 연결 수 산식에 따른 추정이며 실제 rateLimit.cost를 측정한 값이 아님. 최소 1점은 무제한 데이터 수집을 뜻하지 않음.

## 권한 및 수집 한계

공개 REST 조회는 로그인 없이 가능. 서버의 PUBLIC_API_TOKEN이 있으면 사용하고 사용자 토큰은 사용하지 않음. fine-grained token은 공개 Metadata read 범위이며 언어 조회도 Metadata read. GraphQL 대안은 토큰 필요. 비공개 저장소 권한 불필요.

저장소 목록의 첫 31개 중 non-fork 30개까지만 사용. fork 필터링 전에 표본을 제한하므로 최근 30개 non-fork를 반드시 채우지 않음. repositoriesLimited는 원 목록 31개 도달 표시. 이벤트는 30일/300건이라는 GitHub 자체 제한과 지연이 있음. eventsLimited는 300건 도달 시 표시하며 false여도 전체 GitHub 활동을 보장하지 않음.

빈 결과: 성공 200, 빈 언어·토픽 및 0 버킷. 권한 부족: 403 에러로 전달. 수집 상한: coverage 플래그. 요청 도중 실패는 부분 데이터를 정상으로 보내지 않고 전체 에러로 전달. 삭제된 저장소 404 역시 요청 실패이며 조용히 누락시키지 않음.

## 서버 계약

`GET /api/users/:login/develop-style?timezone=Asia%2FSeoul`

- login: 1~39자 영숫자·하이픈. 앞뒤 하이픈·연속 하이픈 불가.
- timezone: 선택 IANA 식별자, 기본 Asia/Seoul. Intl 검증. 배열/객체 또는 알 수 없는 쿼리는 400.
- body: 없음. 임의 기간 파라미터 없음.
- 성공: CommonResponse<UserDevelopStyle>. 타입은 backend/src/types/response/user-develop-style.ts.
- languages, otherPercentage, topics, hourly(24개), weekly(월~일 7개), collaboration, coverage, workTypes 반환.
- coverage: from/to ISO, timezone, events, repositories, eventsLimited, repositoriesLimited, scope=public.
- 오류: CommonErrorResponse. 400 입력, 401 서버 토큰, 403 권한/제한, 404 대상 없음, 429 제한, 500 외부 응답·타임아웃·기타 오류.
- 캐시: 공개 데이터만 서버 public max-age=300. 프론트 QueryKeys.USER_DEVELOP_STYLE, 사용자·시간대별 staleTime 5분, retry 3.
- APILayer-guide 적용: user.routes.ts → UserDevelopStyleControllers → UserDevelopStyleServices → GithubUserDevelopStyleClient. routes는 연결과 API 주석만, 컨트롤러는 파라미터 추출과 응답, 서비스는 입력 검증·수집 흐름 조율, 클라이언트는 메서드당 API 하나 호출 및 외부 오류 변환을 담당합니다. 하위 공통 오류는 재가공하지 않습니다. 언어·토픽 및 활동 집계는 UserDevelopStyleProcess의 public static 순수 메서드로 분리하고 TDD로 검증합니다. 서비스는 수집·호출 순서와 응답 구성을 담당합니다. 프론트 계약은 변경하지 않습니다.

## 프론트 연동

useUserDevelopStyle 훅에서만 fetch/useQuery. 기존 DashboardPanelLayout 및 ECharts 옵션 유지. 그래프에 points/languages props 추가, 기본 목업은 Storybook용으로 유지하되 실제 페이지는 서버 값만 전달. 로딩·오류·재시도·빈 결과와 한계 안내 표시. 분류 불가능한 작업 유형을 목업으로 대체하지 않음.

## 근거

- [공개 이벤트와 보존·지연 제한](https://docs.github.com/en/rest/activity/events)
- [저장소 목록·언어 및 토픽](https://docs.github.com/en/rest/repos/repos)
- [GraphQL 비용 계산](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api)
- [GraphQL 기여 컬렉션](https://docs.github.com/en/graphql/reference/users)
- [최소 토큰 권한](https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens)

## 검증 결과

- TDD RED: 집계 모듈 미구현으로 테스트 실패 확인. GREEN: 시간대 날짜 경계·이벤트별 집계 및 비기여 이벤트 제외 테스트 통과.
- 집계 4개 + 라우트 호출 2개 + 레이어 검증 3개, 총 9개 통과. 라우트 테스트는 Octokit 응답을 모킹합니다.
- 동일 라우트를 임시 3001 서버에서 실행해 실제 GitHub octocat 조회 HTTP 200, 잘못된 timezone HTTP 400 확인.
- 기존 사용자 라우터의 catch-all 404가 새 라우터를 가로막는 등록 순서 문제를 수정했습니다. 기존 user.routes.ts에서 개발 성향 엔드포인트를 catch-all 앞에 등록한 뒤 실제 프론트 프록시(5173)에서 fluetanol 조회 HTTP 200, 언어 5개·공개 이벤트 22건·저장소 19개 응답을 확인했습니다.
- 빌드 테스트 미실행. 프론트 프록시를 통한 API 응답은 확인했으며 브라우저 시각 검증은 별도입니다.





