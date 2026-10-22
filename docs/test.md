# 테스트 안내

이 문서는 저장소에서 확인한 현재 테스트 설정을 기록합니다. 모든 테스트가 로컬 의존성 없이 실행된다는 의미는 아닙니다.

## 명령

| 범위 | 명령 | 확인된 설정 |
| --- | --- | --- |
| 백엔드 단위 테스트 | `npm run test:backend` | 백엔드 패키지의 `npm run test`에 위임하며, Node 환경에서 `src/test/*.test.ts`를 대상으로 Vitest를 실행합니다. |
| 프런트엔드 Vitest | `npm --prefix frontend run test:vitest` | jsdom 프런트엔드 프로젝트와 브라우저 기반 Storybook 프로젝트를 실행합니다. |
| 프런트엔드 E2E | `npm --prefix frontend run test:e2e` | `frontend/e2e/`의 Playwright 테스트를 Chromium과 Firefox로 실행합니다. |
| 전체 프런트엔드 테스트 | `npm run test:frontend` | 프런트엔드 Vitest 후 Playwright E2E를 실행합니다. |
| 루트 테스트 | `npm run test` | 프런트엔드 테스트 후 백엔드 테스트를 실행합니다. |

빌드 명령을 검증으로 사용하지 않습니다. 저장소 하네스는 모든 빌드 스크립트 실행을 금지합니다.

## 프런트엔드 테스트 환경

- 프런트엔드 Vitest 테스트 파일은 `frontend/test/**/*.test.{ts,tsx}`에서 찾습니다. `.except.test.`가 포함된 파일은 제외합니다.
- Storybook Vitest 프로젝트는 headless Chromium Playwright를 사용하며 `frontend/.storybook/` 설정을 불러옵니다.
- Playwright는 기본적으로 `http://127.0.0.1:5173`을 사용하며, `PLAYWRIGHT_BASE_URL`이 없으면 `npm run dev -- --host 127.0.0.1 --port 5173`을 시작합니다.
- Playwright 보고서와 실패 산출물은 `frontend/e2e/` 아래에 기록되며 Git에서 무시됩니다.

## 외부 의존성 경계

- 프런트엔드 Vite 프록시는 기본적으로 `/api` 요청을 `http://localhost:3000`으로 보냅니다.
- 루트 Compose 스택은 Redis를 호스트 6380 포트, PostgreSQL을 호스트 6543 포트에 노출합니다. 백엔드는 시작 시 Redis와 Prisma에 연결합니다.
- OAuth와 실제 GitHub API 동작에는 설정된 자격 증명이 필요합니다. 해당 흐름을 다루는 테스트는 기존 interception/mock 또는 명시적으로 준비한 환경을 사용하며, 실제 비밀값을 테스트 출력에 포함하지 않습니다.

## 확인 필요

- 프런트엔드 전용, 백엔드 전용, 전체 스택 변경에 각각 필요한 테스트 범위.
- 인증 E2E 테스트의 표준 로컬 준비 절차와 Redis/PostgreSQL 포함 여부.
- CI 환경, 테스트 매트릭스, 브라우저 설치 실패 처리 기준.
