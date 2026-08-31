# README Commit Activity SVG API 추가

## 변경 사항

- 인증 없이 GitHub README에서 사용할 수 있는 `GET /api/readme/commit-activity.svg` 엔드포인트를 추가했습니다. `username`을 필수로 받고, `from`, `to`, `width`, `height`로 조회 기간과 SVG 크기를 조정할 수 있습니다.
- ECharts SSR SVG 렌더링으로 커밋 활동 라인 차트를 생성하며, 전체 커밋 수·최대 커밋 수·최대 커밋 일자를 함께 표시합니다.
- 저장소별 기여 데이터를 날짜순으로 정렬해 차트의 날짜와 커밋 수가 일치하도록 보정하고, 공통 `GithubCommitActivity` 타입을 분리했습니다.
- 로그인 토큰이 없는 README 요청은 서버의 공개 GitHub API 토큰을 사용하도록 GraphQL 호출을 보완했습니다.
- 기여 데이터와 완성된 SVG를 Redis에 각각 1시간 캐시해 반복 요청의 GitHub API 호출과 SVG 렌더링을 줄였습니다.
- `username` 누락, 잘못된 기간, 1년 초과 기간 등 400 오류는 README에서 바로 확인할 수 있는 오류 SVG 카드로 반환합니다. 공통 오류 객체 설명도 보강했습니다.
- TSX 컴파일 설정과 ECharts 의존성을 추가하고, 배포 환경에 공개 API 토큰 설정을 반영했습니다.
- pre-push 훅의 Codex 문서 생성 안내를 갱신해, 이미 푸시된 브랜치에서는 이전 PR 문서 작성 이후의 변경만 문서화하도록 했습니다.

## 검증 포인트

- `GET /api/readme/commit-activity.svg?username={github-username}` 호출이 `image/svg+xml` 차트를 반환하는지
- `from`·`to`·`width`·`height` 지정 시 차트 기간 및 크기가 반영되는지
- `username` 누락, `from > to`, 1년 초과 기간에서 HTTP 400 오류 SVG가 반환되는지
- 동일 사용자·기간·크기 요청이 Redis 캐시된 기여 데이터 및 SVG를 사용하는지

## 테스트

- 미실행: PR 문서 작성 작업이며, 프로젝트 규칙에 따라 `npm run build`는 실행하지 않았습니다.

---

# README SVG 통계 확장 및 렌더링 구조화

## 변경 사항

- README에서 사용할 SVG API를 controller → service → route 구조로 분리하고, 다음 통계 엔드포인트를 추가했습니다.
  - `GET /api/readme/tech-distribution.svg`
  - `GET /api/readme/preferred-commit-time.svg`
  - `GET /api/readme/weekly-commit-activity.svg`
- 기존 커밋 활동 차트를 포함한 ECharts 옵션을 `render/echart` 모듈로 분리했습니다. 기술 스택 분포, 선호 커밋 시간, 요일별 커밋 활동 차트 렌더러를 각각 추가했습니다.
- 모든 README SVG에 `locale=ko|en|jp` 파라미터를 지원하고, 차트 제목·축·레이블의 언어별 문구를 locale 모듈로 분리했습니다.
- README 전용 날짜·화면 크기·오류 처리 유틸을 추가했습니다. 날짜 기본값은 최근 30일이며, 크기는 width 200~1500 및 height 100~1500 범위로 보정됩니다.
- README SVG 캐시 키에 차트 종류, 언어, 기간, 크기를 포함하도록 Redis 키 생성과 `setEx` 기능을 보강했습니다.
- 저장소 통계 서비스가 GitHub 사용자명과 선택적 액세스 토큰을 기준으로 동작하도록 정리하고, 일부 저장소 서비스 오류를 `CommonError`로 통일했습니다.
- `CommonError`에 400·401·404·500 생성 메서드와 `detailCode`를 추가했으며, README 요청 오류를 SVG 응답으로 일관되게 반환하도록 했습니다.
- 프런트엔드 통계 훅의 API 응답 타입을 실제 데이터 타입에 맞게 수정하고, 저장소 활동 섹션의 null 접근 가능성을 제거했습니다.
- README 유틸의 크기 보정, 표시용 날짜 변환, 날짜 파라미터 초기화 테스트를 추가했습니다.
- Component SVG 생성 에이전트 설정을 추가하고, 백엔드 개발 서버가 `.tsx` 변경을 감지하도록 설정했습니다.

## 검증 포인트

- 각 README SVG 엔드포인트가 `username`과 선택적 `width`·`height`·`locale` 파라미터를 받아 `image/svg+xml`을 반환하는지
- 잘못된 `locale` 또는 누락된 `username` 요청이 오류 SVG와 적절한 HTTP 상태 코드로 반환되는지
- `commit-activity.svg`의 `from`·`to` 범위, 크기 보정, 언어별 레이블이 반영되는지
- 동일한 사용자·차트·언어·기간·크기 조합의 요청이 Redis 캐시를 재사용하는지
- 프런트엔드 통계 화면에서 API 데이터가 없거나 로딩 중일 때 저장소 활동 섹션이 안전하게 렌더링되는지

## 테스트

- 미실행: PR 문서 작성 작업이며, 프로젝트 규칙에 따라 `npm run build`는 실행하지 않았습니다.
