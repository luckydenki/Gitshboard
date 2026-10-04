# 로컬 환경 안내

이 안내서는 저장소에서 확인한 이름, 포트, 책임을 기록합니다. 모든 비밀값은 의도적으로 제외합니다.

## 서비스

| 서비스 | 로컬 접속 | 역할 |
| --- | --- | --- |
| 프런트엔드 개발 서버 | 기본 `http://localhost:5173` | React Router/Vite SPA입니다. `USE_VITE_PROXY=false`가 아니면 `/api`를 백엔드로 프록시합니다. |
| 백엔드 개발 서버 | 기본 `http://localhost:3000` | Express REST 및 GraphQL 서버입니다. |
| Redis | 기본 `redis://localhost:6380` | 사용자 세션과 GitHub 유래 응답을 캐시합니다. |
| PostgreSQL | 호스트 포트 `6543` | Prisma를 통해 사용자와 암호화된 GitHub 토큰 데이터를 저장합니다. |
| Redis Insight | `http://localhost:5540` | 루트 Compose 스택에서 제공하는 선택적 Redis 관리 UI입니다. |

`npm run redis`로 로컬 Redis, PostgreSQL, Redis Insight를 시작합니다. `npm run dev`는 두 애플리케이션 개발 서버와 Redis Compose 스택을 함께 시작합니다.

## 환경 변수 이름

| 변수 | 확인된 용도 |
| --- | --- |
| `DATABASE_URL` | Prisma PostgreSQL datasource URL입니다. |
| `DIRECT_URL` | Prisma direct datasource URL입니다. |
| `REDIS_URL` | Redis 연결 URL입니다. 없으면 백엔드는 `redis://localhost:6380`을 사용합니다. |
| `JWT_SECRET` | 애플리케이션 JWT를 서명하고 검증합니다. |
| `GITHUB_CLIENT_ID` | GitHub OAuth 클라이언트 식별자입니다. 프런트엔드는 Vite 접두사가 붙은 식별자도 읽습니다. |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth 토큰 교환 자격 증명입니다. |
| `VITE_GITHUB_CLIENT_ID` | 프런트엔드 GitHub OAuth 클라이언트 식별자입니다. |
| `VITE_GITHUB_CALLBACK_URL` | 프런트엔드 OAuth 콜백 URL입니다. |
| `VITE_BACKEND_URL`, `VITE_BACKEND_WHERE`, `VITE_BACKEND_LOCAL_URL`, `VITE_BACKEND_PROD_URL` | 프런트엔드 백엔드 주소 선택 유틸리티에 사용됩니다. |
| `USE_VITE_PROXY` | `false`로 설정하면 Vite `/api` 프록시를 비활성화합니다. |
| `PLAYWRIGHT_BASE_URL` | Playwright가 서버를 새로 시작하지 않고 기존 프런트엔드 서버를 사용하게 합니다. |

## 안전

- `.env*` 파일은 Git에서 무시됩니다. 그 내용을 소스, 문서, 로그, 테스트 fixture, 에이전트 응답에 추가하지 않습니다.
- 프로젝트 소유자가 공개 가능한 변수와 예시 값을 정하기 전에는 공개용 `.env.example`을 만들지 않습니다.

## 확인 필요

- 로컬·프리뷰·운영 환경 변수의 승인된 출처와 관리 수명 주기.
- 현재 secure cross-site 쿠키 설정에서 로컬 OAuth가 동작해야 하는지 여부.
