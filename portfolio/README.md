# Gitshboard

> GitHub API를 활용해 사용자와 공개 계정을 검색하고, 로그인한 사용자의 저장소·커밋 이력을 대시보드와 개발 통계로 보여주는 웹 서비스입니다.

## 주요 기능

- GitHub OAuth 로그인 및 JWT 기반 세션 인증
- GitHub 사용자 검색과 검색 결과 페이지 제공
- 프로필, 팔로워·팔로잉 수, 저장소 목록을 한 화면에서 확인하는 대시보드
- 언어 사용 비율, 커밋 시간·요일, 프로젝트 주제를 분석하는 개발 통계
- 최근 Push 시점과 아카이브·Fork 여부를 기준으로 저장소 활동 상태 분류

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React 19, TypeScript, React Router 7, Vite, Tailwind CSS |
| 상태·데이터 관리 | TanStack Query, Zustand, dench-fetch |
| Backend | Node.js 22, Express 5, TypeScript |
| 인증·데이터베이스 | GitHub OAuth, JWT, Cookie, Prisma, PostgreSQL |
| 외부 API | GitHub REST API, GitHub GraphQL API |
| 인프라·품질 | Docker Compose, Vitest, Playwright, Husky |

## 이슈와 해결

### 1. OAuth 토큰을 브라우저에 노출하지 않는 로그인 세션 설계

**문제**  
GitHub OAuth 인증 뒤 액세스 토큰을 프론트엔드에 직접 전달하면 브라우저 저장소와 JavaScript에서 토큰에 접근할 수 있어 노출 위험이 커집니다. 또한 배포 환경에서는 프론트엔드와 백엔드가 다른 출처이므로 쿠키 전송과 CORS 설정도 함께 고려해야 했습니다.

**해결**  
백엔드에서 OAuth `code`를 GitHub 액세스 토큰으로 교환하고, 사용자 정보를 Prisma로 upsert한 뒤 서비스용 JWT만 `httpOnly` 쿠키로 발급했습니다. 프론트엔드는 콜백에서 인증 코드를 백엔드로 전송하고 `credentials: 'include'`로 쿠키 기반 세션을 유지합니다. 백엔드는 허용 출처와 credential 옵션을 명시해 교차 출처 요청을 처리했습니다.

```ts
// backend/src/routes/auth.routes.ts
const appToken = jwt.sign(
  { userId: user.id, githubId: user.githubId },
  jwtToken!,
  { expiresIn: '1h' },
);

res.cookie('app_token', appToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 240 * 60 * 1000,
});
```

**성과**  
GitHub 액세스 토큰을 클라이언트 상태나 응답 본문에 보관하지 않고, 보호 API는 JWT 검증과 DB 사용자 조회를 통과한 요청만 처리하도록 구성했습니다.

**관련 코드**

- [OAuth 토큰 교환·JWT 쿠키 발급](../backend/src/routes/auth.routes.ts)
- [토큰 검증 및 사용자 인증 미들웨어](../backend/src/middlewares/auth.middleware.ts)
- [CORS·Cookie Parser 설정](../backend/src/app.ts)
- [OAuth 콜백 처리](../frontend/app/routes/auth/callback.tsx)

### 2. 여러 GitHub 원천 데이터를 화면용 개발 인사이트로 변환

**문제**  
언어 비율, 커밋 시간, 프로젝트 성격, 활동 상태는 GitHub의 서로 다른 REST/GraphQL 응답에서 얻어야 하며, 원본 응답을 그대로 보여주면 사용자가 자신의 개발 경향을 빠르게 파악하기 어렵습니다. 저장소의 기본 브랜치가 없을 수도 있어 커밋 이력 접근도 안전해야 합니다.

**해결**  
백엔드에서 GraphQL 쿼리로 저장소별 언어 크기와 기본 브랜치 커밋 이력을 조회하고, 프론트엔드 유틸리티에서 언어 크기를 합산해 상위 5개와 `Other` 비율로 정리했습니다. 커밋 시각은 새벽·오전·오후·밤 및 요일 버킷으로 분류하고, 최근 Push 일수·아카이브 여부로 프로젝트 상태를 계산했습니다.

```ts
// frontend/app/utils/statpage.ts
const sorted = [...sizes.entries()].sort((a, b) => b[1] - a[1]);
const total = sorted.reduce((sum, [, size]) => sum + size, 0);
const top = sorted.slice(0, 5);
const otherSize = sorted.slice(5).reduce((sum, [, size]) => sum + size, 0);

return entries.map(([name, size]) => ({
  name,
  size,
  percent: roundPercent(size, total),
  color: languageColors[name] ?? 'bg-github-light',
}));
```

**성과**  
최대 20개 저장소와 저장소별 최대 20개 언어, 기본 브랜치의 최근 커밋 이력을 하나의 통계 화면으로 연결해, 원시 GitHub 데이터를 비교 가능한 개발 지표로 제공했습니다.

**관련 코드**

- [GitHub GraphQL 통계 API](../backend/src/routes/repo.routes.ts)
- [통계 요청 및 화면 조합](../frontend/app/routes/statpage.tsx)
- [통계 계산 로직](../frontend/app/utils/statpage.ts)

### 3. 대시보드 전환 시 중복 요청을 줄이는 캐시와 재수화 처리

**문제**  
대시보드와 통계 화면은 여러 GitHub API를 호출합니다. 화면을 오갈 때마다 같은 데이터를 다시 요청하면 대기 시간이 늘고 GitHub API 호출 제한에도 불리합니다. 반대로 브라우저 저장소의 데이터를 너무 이르게 읽으면 재수화 전의 빈 상태를 캐시로 오인할 수 있습니다.

**해결**  
TanStack Query에는 `staleTime`과 `gcTime`을 설정해 서버 데이터의 신선도와 메모리 보관 시간을 분리했습니다. 저장소 목록처럼 세션 동안 재사용할 데이터는 Zustand `persist`로 `sessionStorage`에 저장하고, `onRehydrateStorage` 완료 후에만 캐시 사용 여부를 판단했습니다. 여러 API가 필요한 경우에는 `Promise.all`로 병렬 요청합니다.

```ts
// frontend/app/hooks/useFetchAll.ts
if (!hashydrate && !fetchMap) return;

const hasEveryData = cachedData.every(data => data !== null);
if (hasEveryData) {
  setDataState(cachedData as T);
  setIsLoading(false);
  return;
}

const data = await Promise.all(req);
```

**성과**  
세션 안에서는 모든 요청 데이터가 유효할 때 캐시를 재사용하고, 하나라도 만료되었을 때만 다시 요청하도록 하여 대시보드 탐색 시 불필요한 네트워크 요청을 줄이는 구조를 만들었습니다. 인증 오류(401)는 재시도 대상에서 제외해 로그인 화면으로 빠르게 복귀하도록 했습니다.

**관련 코드**

- [세션 캐시와 재수화 완료 상태](../frontend/app/stores/fetchStore.ts)
- [복수 API 병렬 요청·캐시 판별](../frontend/app/hooks/useFetchAll.ts)
- [대시보드 쿼리 캐시와 401 재시도 제어](../frontend/app/routes/dashboard.tsx)
- [QueryClient 생명주기 관리](../frontend/app/components/layout/DashboardLayout.tsx)

## 실행 환경

- 프론트엔드와 백엔드는 Node.js 22.19.0 기반 Docker 이미지로 구성했습니다.
- 개발 환경은 Docker Compose의 `develop.watch`로 소스 변경을 컨테이너에 동기화합니다.
- 루트 `npm run build`로 프론트엔드와 백엔드 빌드를 함께 실행합니다.
