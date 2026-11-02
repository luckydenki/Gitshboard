# 검색 카테고리 수정 및 홈·검색 Storybook 재정비

## 작성 범위

- 브랜치: `refactor-design`
- 로컬 원격 추적 참조의 reflog에서 확인한 마지막 push: `3631b3b` (2026-11-02 15:03:11 +09:00)
- 비교 범위: `3631b3b..f69c8c4`의 19개 커밋. 마지막 push 이전 변경은 제외했습니다.
- 현재 작업 트리에 기존 `pr-body.md`가 없어 새로 작성했습니다.

## 변경 사항

### 검색 UI 및 페이지 메타데이터

- 검색 카테고리 컨트롤의 바깥 요소를 `button`에서 `div`로 바꾸어 내부 선택 버튼과의 중첩을 해소하고, 카테고리 선택 상태가 바뀌지 않던 문제를 수정했습니다.
- 공통 `React-Github` 제목을 제거하고 홈 제목을 `Gitshboard`로 변경했습니다.
- 사용자 대시보드 제목에 URL의 사용자와 현재 메뉴를 반영하고, 검색·로그인 콜백·컴포넌트 개발 페이지 및 오류 화면의 제목을 보완했습니다.
- 검색 페이지와 사용자 개발 성향 화면에 설명 메타데이터를 추가했습니다.
- 파비콘을 서비스 로고로 교체했습니다.

### Storybook 문서 및 상호작용 사례

- 이전 레이아웃·기여도·검색 컴포넌트의 오래된 스토리를 제거하고, 현재 홈·검색 컴포넌트 중심으로 재구성했습니다.
- 홈의 `GitHubBlogBanner`, `HomeBoardList`, `MainLogo`, `SearchBar`와 검색의 `SearchCategoryOpenButton`, `SearchFilter`, `SearchItemLayout`, `SearchRepoItem`, `SearchResultHeader`, `SearchUserItem`에 스토리와 한국어 MDX 문서를 추가했습니다.
- 컴포넌트 요약·props·사용 예시를 문서화하고, 빈 데이터·긴 문자열·큰 수치·로딩·페이지 경계 등 시각적 사례를 추가했습니다.
- 블로그 페이지 이동, 검색 입력과 이동, 카테고리 선택, 필터 변경, 사용자·저장소 대시보드 링크 이동 등의 상호작용 검증 코드를 추가했습니다.
- 홈·검색 Storybook mock 데이터를 분리하고, `public` 정적 자산 경로를 등록했습니다. 중복 preview 파일을 제거하고 접근성 검사 설정을 `preview.ts`로 모았습니다.

### 테스트 구성 및 CI

- 기존 E2E 시나리오와 fixture를 삭제했습니다. Playwright 실행 설정과 `test:e2e` 스크립트는 유지하며, 기본 `npm test`에서는 E2E 실행을 제외하고 Vitest만 실행하도록 변경했습니다.
- 검색 폼 디바운스 호출 측정 테스트를 삭제하고, 날짜 비교·검색 데이터 테스트의 import 경로를 `old` 컴포넌트 위치에 맞게 수정했습니다.
- 프런트엔드에 `chromatic` 스크립트를 추가하고, PR CI에 Chromatic 실행 단계를 추가했습니다.
- push마다 Chromatic을 실행하는 별도 워크플로우를 추가하고, PR 자동 생성 및 CI 워크플로우의 역할 설명 주석을 보완했습니다.
- AGENTS.md의 모델 선택·Storybook·커밋 지침과 커밋 가이드를 보완했습니다.

## 리뷰 및 확인 포인트

- 검색 카테고리 변경과 필터 선택이 화면에 반영되는지 확인이 필요합니다. 카테고리 스토리는 부모의 blur로 메뉴가 사라질 수 있어 선택에 `fireEvent.click`을 사용합니다. 실제 포인터 및 키보드 동작은 별도 확인이 필요합니다.
- 각 화면의 제목과 사용자·메뉴별 대시보드 제목이 올바르게 표시되는지 확인이 필요합니다.
- Chromatic 실행에는 `CHROMATIC_PROJECT_TOKEN` secret이 필요합니다. 별도 `chromatic.yml`은 저장소 루트에서 npm 명령을 실행하지만 `chromatic` 스크립트는 `frontend/package.json`에 있으므로 실행 경로 확인이 필요합니다.
- 기존 E2E 시나리오는 제거되어 기본 CI에서 브라우저 사용자 흐름을 검증하지 않습니다.

## 검증

- Git 로그·push reflog·마지막 push 이후 파일 diff를 확인해 작성했습니다.
- 프로젝트 지침에 따라 빌드, Vitest, E2E 및 Storybook 테스트는 실행하지 않았습니다. 추가된 테스트의 통과 여부와 GitHub Actions 실행 결과는 확인하지 않았습니다.
