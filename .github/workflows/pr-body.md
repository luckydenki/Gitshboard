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
