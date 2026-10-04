# 백엔드 하네스

먼저 루트 [AGENTS.md](../AGENTS.md)를 읽습니다. 해당 파일의 안전, 빌드 금지, Token.md 규칙이 이 디렉터리에도 적용됩니다.

## 구조와 요청 흐름

- `src/app.ts`는 Express, CORS, JSON/쿠키 파싱, Prisma·Redis 시작, API 라우트 마운트를 설정합니다.
- 라우트는 `src/routes/`, JWT·사용자 인증 미들웨어는 `src/middlewares/auth.middleware.ts`, 컨트롤러는 `src/controllers/`, 비즈니스·캐시 조율은 `src/services/`, GitHub API 어댑터는 `src/client/`, 데이터·캐시 추상화는 `src/repository/`, Redis 연결 설정은 `src/infra/redis/`에 있습니다.
- 새 REST 엔드포인트는 확인된 흐름인 `route -> 적용할 인증 미들웨어 -> controller -> service -> GitHub client 및/또는 repository -> controller response`를 사용합니다.
- 컨트롤러는 최종 `CommonResponse<T>` 또는 `CommonErrorResponse`를 생성합니다. 하위 계층은 도메인 데이터를 반환하거나 오류를 전파합니다. `src/types/middlewares/common.ts` 타입과 [응답 컨벤션](../conventions/response_convention.md)을 사용합니다.

## 인증, 오류, 영속성

- JWT는 httpOnly `app_token` 쿠키에서 검증합니다. 보호 라우트는 `authToken`과 `authUser`를 함께 사용하고, 선택 인증 검색은 `checkToken`, `checkUser`를 따릅니다.
- 백엔드 오류에는 `CommonError`, `CommonErrorResponse`를 사용하고 [오류 컨벤션](../conventions/error_convention.md)을 따릅니다. 기존 컨트롤러 수준의 HTTP 응답 경계를 보존합니다.
- Prisma는 PostgreSQL에 연결합니다. 현재 스키마는 `User`와 일대일 `EncryptionKey`를 가지며, GitHub 액세스 토큰은 암호화 구조체로 저장하고 서버 측 GitHub 호출에서만 복호화합니다.
- 스키마 작업 시 `prisma/schema.prisma`와 기존 마이그레이션을 함께 확인합니다. 작업에서 명시적으로 허용하지 않았다면 마이그레이션을 실행하지 않습니다.
- Redis는 `REDIS_URL`을 사용하고 없으면 `redis://localhost:6380`으로 연결합니다. 인증 캐시는 `gitshboard:user:{userId}`와 200초 TTL, 저장소 통계 캐시는 `gitshboard:stats:{username}:{kind}`와 300초 TTL을 사용합니다. 캐시 키의 소유 범위와 만료 시간을 의도적으로 관리합니다.
- 환경 변수는 이름과 용도만 언급하고 값은 출력하지 않습니다. 관련 변수는 `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`입니다.

## 검증

- `npm run test`는 Node 환경에서 `src/test/*.test.ts`를 대상으로 Vitest를 실행합니다.
- `npm run build` 및 이 패키지의 `build` 스크립트를 실행하지 않습니다.
- Redis·PostgreSQL·GitHub API·OAuth·Docker 의존 검증에는 명시적인 작업 범위와 비밀값 없는 로컬 준비가 필요합니다. [테스트 안내](../docs/test.md), [환경 안내](../docs/environment.md)를 참고합니다.
