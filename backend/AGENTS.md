# BACKEND AGNETS.md

먼저 루트 [AGENTS.md](../AGENTS.md)를 읽고 기본 지침은 이해하고 오세요.
이 문서는 백엔드 agents.md입니다.


## API 개설 규칙

API를 만들어달라는 개설 요청시 `(프로젝트루트)/docs/backend/APICreate-guide.md`를 참고하세요.


## API 타입 규칙

API와 관련된 모든 타입관련 규칙은 `(프로젝트루트)/docs/backend/APIType-guide.md`를 참고하세요.


## API 개설 시 기본 문서화 규칙

API 개설 시 라우터 코드 바로 위쪽에 다음과 같은 주석 (/** */문법) 을 추가하세요.

1. 해당 api의 api url과 메서드 : `@api`
```ts
/**
 * @api GET /api/health
*/
router.get("/health", ...)
```

2. 해당 api에 대한 간략한 설명 : `@desc`

3. (있는 경우) 해당 api로 들어오는 쿼리 파라미터에 대한 설명 : `@query`

4. 해당 api가 github api와 연관있는 경우, 그에 연관 있는 github api에 대한 설명 : `@github`
- graphql 이면 관련 쿼리를 볼 수 있는 파일 경로를, rest 면 관련 타입을 볼 수 있는 타입 파일 경로를 쓰면 됩니다.

5. 해당 api가 반환하는 응답에 대한 설명 : `@response`
- 진짜 그 response 데이터를 다 설명하지는 말고, 그 설명을 볼 수 있는 타입 파일 경로를 적어주십쇼...

6. 해당 api로 만들어질 수 있는 모든 에러에 대한 설명 : `@error`
- `[에러 번호] : 에러 사유` 로 작성해주세요.
뭐 같은 에러로 여러 에러 사유가 발생할 수 있는데, 그럼 [에러 번호] : 에러사유1, 에러사유2,... 이렇게 적으세요.

7. 각 @ 필드는 서로 다른 필드의 경우 엔터로 구분되어있어야 합니다. (아래 예시 참고)

ex
```ts
/**
 * @api GET /api/search/users
 *
 * @desc GitHub 사용자와 조직의 공개 프로필을 검색합니다.
 *
 * @query q (string, 필수) - 검색어와 검색 조건.
 * @query page (integer, 선택) - 기존 페이지 번호. 기본값 1.
 * @query per_page (integer, 선택) - 페이지당 결과 수. 기본값 30, 최대 100.
 * @query after (string, 선택) - 이전 응답의 다음 페이지 커서. page는 1이어야 합니다.
 * @query sort (followers | repositories | joined, 선택) - 정렬 기준.
 * @query order (asc | desc, 선택) - 정렬 방향. sort 지정 시 기본값 desc.
 *
 * @github backend/src/client/queries/github/search-users.query.ts
 *
 * @response backend/src/types/response/search-users.ts
 *
 * @error [400] : 검색어, 페이지, 커서 또는 정렬 옵션이 잘못된 경우.
 * @error [500] : GitHub 검색 요청 또는 응답 처리가 실패한 경우.
 */
```
