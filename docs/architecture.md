# 아키텍처 안내

## 시스템 구성

```text
React Router 프런트엔드
  -> /api 요청(로컬 개발에서는 Vite 프록시)
  -> Express 백엔드
      -> JWT/쿠키 미들웨어
      -> 컨트롤러와 서비스
      -> GitHub REST·GraphQL 클라이언트
      -> Redis 캐시와 Prisma/PostgreSQL 영속성
```

프런트엔드는 React Router SPA입니다. `app/routes.ts`는 공개 홈·검색 라우트, 보호된 대시보드·통계·기여 라우트, GitHub OAuth 콜백을 정의합니다. `RouteGuardLayout`은 보호된 라우트 콘텐츠를 렌더링하기 전에 `/api/auth/check`을 확인합니다.

## 인증 흐름

1. 프런트엔드가 GitHub OAuth를 시작하고 `auth/github/callback`에서 `code`를 받습니다.
2. 콜백이 쿠키 자격 증명과 함께 코드를 `/api/auth/github`로 POST합니다.
3. 백엔드는 GitHub와 코드를 교환하고 사용자 정보를 가져와 Prisma `User`를 upsert한 뒤, 관련 암호화 토큰 데이터를 `EncryptionKey`에 upsert합니다.
4. 백엔드는 `{ userId, githubId }`를 JWT로 서명하고 httpOnly `app_token` 쿠키를 발급합니다.
5. 보호 엔드포인트는 `authToken` 후 `authUser`를 사용합니다. `authUser`는 Redis 또는 Prisma에서 암호화 토큰 레코드를 가져와 서버 측에서 복호화하고 사용자 정보를 요청에 추가합니다.

## 응답과 오류 경계

- 컨트롤러는 성공 HTTP 응답을 `CommonResponse<T>`로 반환합니다.
- 백엔드 실패는 `CommonError`/`CommonErrorResponse`를 사용합니다. 프런트엔드 호출부는 비정상 응답을 `CommonErrorResponse`로 파싱하거나 네트워크 실패를 `CommonError`로 변환합니다.
- 서비스는 캐시와 GitHub 접근을 조율하며 GitHub REST/GraphQL 어댑터는 `backend/src/client/`에 있습니다.

## 데이터와 캐시 소유 범위

| 데이터 | 기본 저장소 | 확인된 캐시 패턴 |
| --- | --- | --- |
| 사용자 식별 정보와 암호화된 GitHub 토큰 데이터 | Prisma를 통한 PostgreSQL | `authUser`의 `gitshboard:user:{userId}`, 200초 |
| 저장소 언어·커밋 시간·주제·개발자 프로필·상태 통계 | GitHub GraphQL 유래 서비스 데이터 | `repo.services.ts`의 `gitshboard:stats:{username}:{kind}`, 300초 |
| 기여 활동 | GitHub 유래 서비스 데이터 | `contribution.services.ts`의 직접 Redis 키 `commitActivity:{username}:{from}{to}`, 1시간 |
| README SVG 통계 | GitHub 유래 렌더링 결과 | `redisRepository.createRedisKey`로 키를 구성하며, 만료 시간은 호출 서비스에서 확인해야 함 |

## 확인 필요

- 현재 secure, `sameSite: 'none'` 쿠키 정책이 의도한 로컬 개발 정책인지 여부.
- 확인된 TTL 외 GitHub 데이터의 확정된 캐시 무효화 정책.
- Vercel, Docker, PostgreSQL, Redis의 운영 토폴로지와 배포 책임.
