# 프런트엔드 하네스

먼저 루트 [AGENTS.md](../AGENTS.md)를 읽습니다. 해당 파일의 안전, 빌드 금지, Token.md, Storybook 규칙이 이 디렉터리에도 적용됩니다.

## 구조와 책임

- 이 앱은 React 19, React Router 7, Vite, Tailwind CSS, TanStack Query, Zustand를 사용합니다. React Router는 SPA 모드(`ssr: false`)로 실행됩니다.
- 라우트는 `app/routes.ts`부터 확인합니다. 페이지 라우트는 `app/routes/`, 재사용 UI는 `app/components/`, 레이아웃은 `app/components/layout/`, 데이터 패칭 훅은 `app/hooks/`와 `app/hooks/pages/`에 있습니다.
- 페이지 렌더링 상태는 페이지 컴포넌트에 둡니다. 단순하지 않은 쿼리·이펙트·메모이즈 데이터 로직은 훅에 두며 [프런트엔드 컨벤션](../conventions/front_convention.md)을 따릅니다.
- [파일명 컨벤션](../conventions/file_name_convention.md)을 따릅니다. 기존 라우트 파일명은 문서의 `*-page.tsx` 규칙과 완전히 일치하지 않으므로, 작업 범위에 명시되지 않았다면 기존 파일명을 바꾸지 않습니다.

## API, 인증, 오류

- 성공 API 본문에는 `CommonResponse<T>`, 오류에는 `CommonErrorResponse`를 사용합니다. 공통 프런트엔드 타입은 `app/types/common/common.ts`에 있습니다.
- 성공하지 않은 HTTP 응답은 `!res.ok`로 확인하고 JSON 오류 본문을 파싱한 뒤, 기존 호출부 패턴에 맞춰 throw하거나 `CommonError`로 변환합니다.
- 보호 라우트는 `RouteGuardLayout` 아래에 있으며, `/api/auth/check`와 `app_token` 쿠키로 인증 상태를 확인합니다.
- 쿠키 인증이 필요한 요청에는 반드시 `credentials: 'include'`를 사용합니다. `/api/auth/github`를 통한 기존 OAuth 콜백 흐름을 보존합니다.

## 쿼리와 검증

- 공통 쿼리 동작에는 `QueryKeys`, `useManagedKeyQuery`, `commonRetry`를 사용합니다. 키와 신선도 정책은 [TanStack Query 컨벤션](../conventions/tanstack_query_convention.md)을 따릅니다.
- `npm run test:vitest`는 브라우저 기반 Storybook 테스트를 포함한 프런트엔드 Vitest 프로젝트를 실행합니다. `npm run test:e2e`는 Playwright를, `npm run test`는 둘 다 실행합니다.
- Playwright는 기본적으로 프런트엔드 개발 서버를 시작합니다. 백엔드 응답·OAuth·Redis·PostgreSQL이 필요한 테스트는 해당 의존성 또는 명시적 mock이 필요합니다. [테스트 안내](../docs/test.md)를 참고합니다.
- 어떤 `build` 스크립트도 실행하지 않습니다.
