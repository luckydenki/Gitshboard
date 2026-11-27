# 관심사 페이지 API 조사 및 설계안

## 범위와 상태

대상은 `frontend/app/routes/user-dashboard/UserDashboardInterestsSection.tsx`의 관심사 화면입니다. 기존 조사 내용을 정리한 구현 전 설계안이며, 이 문서 작성으로 조회 기록 수집·DB·API가 구현되는 것은 아닙니다.

현재 화면은 목업 데이터를 사용합니다. 조사 당시 Prisma에는 사용자·암호화키 모델만 있고, 사이트 조회 기록 모델은 없었습니다.

## 핵심 결론

현재 화면의 의미를 유지하려면 GitHub API 연동보다 사이트 자체 조회 기록 수집이 먼저 필요합니다. GitHub에서 직접 열람한 기록은 가져오지 않으며, 우리 사이트에서 저장소·개발자 대시보드를 조회한 사실만 기록합니다.

관심사의 주체는 전적 대상 사용자가 아니라 현재 사이트를 이용하는 사람으로 제안합니다. 다른 사용자의 프로필 페이지에서도 동일한 이용자의 관심사를 표시하며, `/api/me` 경로와 인증 사용자 기준으로 접근합니다. 이 주체 정책은 구현 전에 확정해야 합니다.

## 패널별 데이터와 분류

| 패널 | 필요한 데이터 | 원천과 처리 | 분류 |
| --- | --- | --- | --- |
| 나의 탐색 요약 | 기간, 상위 주제, 요약 문장 | 조회 기록과 저장소 토픽 빈도 집계. 성향을 설명하는 문장은 별도 규칙 필요 | 자체 기록 + 단순 집계, 문장은 규칙 기반 |
| 많이 살펴본 주제 | 주제명·조회 횟수 | 사이트 저장소 조회와 GitHub 토픽 연결 후 합산 | 자체 기록 + 단순 집계 |
| 자주 살펴본 레포지토리 | 저장소명·설명·토픽·URL·조회 횟수 | 메타데이터는 GitHub, 횟수는 자체 기록 | 직접 조회 + 단순 집계 |
| 자주 찾아본 개발자 | 사용자명·소개·URL·조회 횟수 | 프로필은 GitHub, 횟수는 자체 기록 | 직접 조회 + 단순 집계 |
| 이런 프로젝트는 어떠세요? | 저장소 정보·선정 순위·추천 이유 | GitHub 검색으로 후보 확보 후 별도 선정 규칙 필요 | 규칙 기반 |

GitHub 토픽을 ‘프론트엔드’ 같은 상위 분야로 묶는 과정도 단순 빈도 계산과 구별해야 합니다. 원본 토픽을 그대로 집계하는 것은 가능하지만 분야 분류·가중치·성향 판단은 별도 정책입니다. 한 저장소에 토픽이 여러 개면 주제별 횟수 합이 실제 조회 횟수보다 많아질 수 있습니다.

## GitHub API의 역할과 한계

| 목적 | 사용 가능한 GitHub API | 주의점 |
| --- | --- | --- |
| 저장소 메타데이터 | REST `GET /repos/{owner}/{repo}` | 저장소 정보·토픽 보충. 개인 조회 횟수는 없음 |
| 개발자 프로필 | REST `GET /users/{username}` | 이름·소개·프로필 URL 보충. 방문 기록은 없음 |
| 추천 후보 | REST `GET /search/repositories?q=topic:...` | 검색 결과 자체는 개인화 추천이 아님 |
| Star 기반 대안 | REST `GET /users/{username}/starred` | 현재의 ‘조회 기록’과 다른 의미. 채택 시 화면 명칭과 집계 기준 변경 필요 |
| 저장소 방문 통계 | REST `GET /repos/{owner}/{repo}/traffic/views` | 특정 저장소에 들어온 방문 통계. 개인이 방문한 대상 목록이 아니므로 현재 화면에 사용 불가 |

Traffic API는 접근 권한이 있는 저장소의 집계 지표이며 fine-grained token에 Administration read가 필요합니다. 이를 개인 탐색 기록을 얻기 위한 권한으로 요구하지 않습니다.

## REST와 GraphQL 비교

| 데이터 | REST 인자·최소 호출 | GraphQL 대안 | 최소 비용 및 제한 |
| --- | --- | --- | --- |
| 저장소 정보·토픽 | owner, repo. 캐시 누락 저장소당 1회 | repository(owner, name), repositoryTopics(first, after) | 묶음 조회 최소 1점부터. 토픽 페이지 추가 여부에 따라 비용 증가 |
| 개발자 프로필 | username. 캐시 누락 사용자당 1회 | user(login) | 묶음 조회 최소 1점부터. 실제 쿼리 비용 확인 필요 |
| 추천 후보 검색 | q, sort, order, per_page, page. 검색당 최소 1회 | search(query, type:REPOSITORY, first, after) | 최소 1점부터. 검색 조건과 페이지에 따라 추가 비용 |
| 자체 조회 횟수·순위 | GitHub 호출 없음 | 해당 없음 | 자체 DB 집계. 메타데이터가 캐시되어 있으면 관심사 화면의 GitHub 호출은 0회 가능 |

GraphQL 점수는 최소값·추정이며 실측치가 아닙니다. 구현 시 `rateLimit.cost`로 확인합니다. 캐시가 없다면 저장소 N개·개발자 M개의 REST 보충 비용은 최소 N+M회입니다. 추천 검색은 별도 비용입니다.

공개 저장소·공개 프로필만 보충하면 비공개 저장소 권한은 필요하지 않습니다. 공개 REST 조회는 비인증으로 가능한 범위가 있지만 호출 제한을 고려해야 합니다. GraphQL은 인증 토큰이 필요합니다. 토큰 방식별 최소 권한은 최종 호출 API를 확정한 후 재확인합니다.

## 자체 API 제안

모든 읽기 응답은 `CommonResponse<T>`, 오류는 `CommonErrorResponse`를 사용합니다. 아래 경로·타입은 제안이며 아직 개설되지 않았습니다.

| 메서드·경로 | 목적 | 입력 | 성공 데이터 예시 |
| --- | --- | --- | --- |
| `POST /api/me/view-history` | 사이트 내 조회 기록 저장 | body: kind(repository 또는 developer), identifier(owner/repo 또는 login) | 기록 수락 여부. 사용자와 시간은 서버에서 결정 |
| `GET /api/me/interests/summary?days=30` | 조회 주제·기간 요약 | days | period, totalViews, topics: [{name, count}], coverage |
| `GET /api/me/interests/repositories?days=30&limit=3` | 자주 조회한 저장소 | days, limit | items: [{fullName, description, topics, url, visits}], coverage |
| `GET /api/me/interests/developers?days=30&limit=3` | 자주 조회한 개발자 | days, limit | items: [{login, name, bio, url, visits}], coverage |
| 추천 API | 별도 선정 기준 확정 후 설계 | 미정 | 구현 전에는 UpcomingBackdrop 사용 제안 |

GET 요청 body는 없습니다. 제안 검증 범위는 days=1~30 정수, limit=1~10 정수이며 기본값은 각각 30·3입니다. 저장소 식별자는 owner/repo 구조와 GitHub 허용 형식을, 개발자는 GitHub login 형식을 검사합니다. 인증 사용자 식별자는 body로 받지 않습니다. 임의 URL 대신 식별자를 받아 외부 요청 대상을 제한합니다.

로그인 사용자의 기록만 조회하며 인증되지 않은 요청은 401로 처리합니다. 다른 사용자의 기록을 login 파라미터로 조회하는 공개 API는 제안하지 않습니다.

## 상태·오류와 부분 결과

| 상황 | 제안 처리 |
| --- | --- |
| 기록 없음 | 200 성공, 빈 items/topics 및 0건. 목업 데이터로 대체하지 않음 |
| 잘못된 body·기간·개수·식별자 | 400 입력 오류 |
| 미인증 | 401 |
| GitHub 접근 제한·호출 제한 | 403 또는 429. 빈 결과와 구분 |
| 삭제·비공개 전환된 대상 | 조회 기록은 보존하되 메타데이터 unavailable 표시 등 정책 확정 필요. 전체 기록 없음으로 오인하지 않게 처리 |
| 일부 메타데이터 수집 실패 | coverage/status로 partial과 원인 표시. 정상 빈 목록과 구별 |
| DB 또는 외부 API 장애 | 500 등 오류 응답. 내부 오류·토큰을 노출하지 않음 |

메타데이터가 일부 없어도 기록 집계를 보여줄지, 전체 요청을 실패시킬지는 구현 전에 확정해야 합니다. 개인 기록 응답은 공개 캐시로 제공하지 않으며, 프론트 캐시 키도 인증 사용자별로 구분하고 계정 전환 시 분리합니다.

## 기록 저장과 집계에 필요한 정책

| 정책 | 결정할 내용 |
| --- | --- |
| 집계 주체 | 로그인한 방문자 자신의 기록인지 최종 확정 |
| 조회 인정 시점 | 대시보드 정상 진입 등 명확한 기준. 단순 API 재시도와 중복 집계 구분 |
| 중복 처리 | 새로고침·탭 중복·짧은 시간 재방문을 몇 회로 셀지 결정 |
| 보존 기간 | 최근 30일 화면과 별도로 원본 보존·삭제 정책 결정 |
| 토픽 기준 | 조회 당시 토픽 스냅샷 또는 현재 토픽 중 선택 |
| 분야 분류 | 원본 토픽 표시 또는 자체 분야 매핑 규칙 선택 |
| 추천 선정 | 후보 검색 조건, 이미 조회한 대상 제외, 정렬·추천 이유 기준 |
| 비로그인 사용자 | 초기 범위에서 미지원하거나 별도 로컬 기록 정책 결정 |

기록 흐름 예시: 로그인 사용자가 우리 사이트의 facebook/react 대시보드에 진입 → 서버가 인증 사용자·대상·시각을 기록 → 관심사 API가 최근 30일 저장소·개발자·토픽별 횟수를 집계합니다. GitHub 사이트에서 직접 방문한 이력은 수집 범위에 포함하지 않습니다.

## 제안 구현 순서

| 단계 | 작업 |
| --- | --- |
| 1 | 조회 주체·중복 집계·보존 정책 확정 |
| 2 | 자체 조회 기록 DB와 저장 API 구현 |
| 3 | GitHub 메타데이터 보충·캐시와 조회 순위 API 구현 |
| 4 | 주제 빈도 집계와 관심사 화면 연동·패널별 UX 점검 |
| 5 | 별도 추천 규칙 설계 후 후보 검색·추천 API 구현 |

## 공식 근거

- [저장소 Traffic API](https://docs.github.com/en/rest/metrics/traffic)
- [저장소 정보 API](https://docs.github.com/en/rest/repos/repos)
- [사용자 프로필 API](https://docs.github.com/en/rest/users/users)
- [저장소 검색 API](https://docs.github.com/en/rest/search/search#search-repositories)
- [Star한 저장소 API](https://docs.github.com/en/rest/activity/starring#list-repositories-starred-by-a-user)
- [GraphQL 비용·제한](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api)

이 문서는 앞서 확인한 공식 문서를 바탕으로 한 조사 정리입니다. 구현 시점에 권한·비용·제한을 다시 확인해야 합니다.
