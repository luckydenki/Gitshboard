# Gitshboard Codex 하네스

## 항상 지킬 규칙

1. 작업을 시작하기 전에 적용되는 `AGENTS.md` 파일을 다시 읽습니다. 하위 디렉터리의 규칙은 이 파일의 규칙에 추가로 적용됩니다.
2. 사용자의 기존 변경 사항을 보존합니다. `.env*`, 쿠키, 토큰, 데이터베이스 URL 등 비밀값을 노출·복사·커밋·로그 기록하지 않습니다.
3. hard reset, force push, pull 등 파괴적인 Git 작업을 수행하지 않습니다. 사용자가 브랜치 또는 커밋 작업을 요청하면 [Git 컨벤션](conventions/git_convention.md)을 따릅니다.
4. `npm run build`, `npm run build:frontend`, `npm run build:backend` 및 각 패키지의 `build` 스크립트를 실행하지 않습니다. 이 규칙은 `conventions/git_convention.md`의 빌드 권장 사항보다 우선합니다.
5. 작업이 완료되면 `Token.md`의 맨 마지막에 날짜가 포함된 항목을 추가합니다. 기존 이력을 덮어쓰지 않습니다.

다음 형식을 사용합니다.

```md
> 프롬프트 내용
- 요청 시간 : yyyy-mm-dd
- 사용 토큰량 : 약 n,nnn
- 수행한 작업 :

---
```

## 저장소 구성과 명령

- `frontend/`: React 19, React Router 7, Vite, Tailwind CSS, TanStack Query, Zustand를 사용합니다. 변경 전 [frontend/AGENTS.md](frontend/AGENTS.md)를 읽습니다.
- `backend/`: Express 5 TypeScript API이며 Prisma/PostgreSQL, Redis, GitHub REST/GraphQL, JWT 쿠키 인증을 사용합니다. 변경 전 [backend/AGENTS.md](backend/AGENTS.md)를 읽습니다.
- 루트 `compose.yml`은 로컬 Redis, Redis Insight, PostgreSQL을 제공합니다. `npm run dev`는 Redis Compose 스택과 두 애플리케이션 개발 서버를 함께 시작합니다.
- `npm run test:frontend`, `npm run test:backend`는 각 패키지의 테스트를 실행합니다. 여러 애플리케이션에 걸친 검증이 필요하지 않다면 대상 패키지 명령을 우선 사용합니다.

## 컨벤션과 Storybook

다음 문서는 상세 규칙의 기준입니다: [응답](conventions/response_convention.md), [오류](conventions/error_convention.md), [프런트엔드](conventions/front_convention.md), [TanStack Query](conventions/tanstack_query_convention.md), [파일명](conventions/file_name_convention.md), [Git](conventions/git_convention.md), [AI 명령](conventions/ai_command_convention.md).

Storybook을 추가·수정·삭제할 때는 다음을 따릅니다.

1. `gitshboard-storybook-mcp` MCP를 사용합니다.
2. 컴포넌트 스토리를 새로 만들기 전에 `get-storybook-story-instructions`를 호출하고 결과를 따릅니다.
3. Storybook 테스트 이름은 한글로 작성합니다.

## 이 하네스가 관리하는 문서

- [테스트 안내](docs/test.md): 명령과 확인된 테스트 환경 경계를 기록합니다.
- [환경 안내](docs/environment.md): 비밀값을 제외한 로컬 의존성과 환경 변수 이름을 기록합니다.
- [아키텍처 안내](docs/architecture.md): 확인된 요청·인증·데이터베이스·캐시 흐름을 기록합니다.

이 문서에서 **확인 필요**로 표시한 항목은 소유자가 확인하기 전까지 필수 규칙으로 승격하지 않습니다.
