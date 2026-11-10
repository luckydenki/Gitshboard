# BACKEND AGNETS.md

먼저 루트 [AGENTS.md](../AGENTS.md)를 읽고 기본 지침은 이해하고 오세요.
이 문서는 백엔드 agents.md입니다.


## API 개설 규칙

API를 만들어달라는 개설 요청시 `(프로젝트루트)/docs/backend/APICreate-guide.md`를 참고하세요.



## API 개설과 관련된 주석 작성 수칙

API를 만들어달라는 개설 요청에는 라우터 코드 바로 위쪽에 다음과 같은 주석 (/** */문법) 을 추가하세요 

1. 해당 api의 api url과 메서드 : `@api`
```ts
/**
 * @api GET /api/health
*/
router.get("/health", ...)
```

2. 해당 api에 대한 간략한 설명 : `@desc`

3. (있는 경우) 해당 api로 들어오는 쿼리 파라미터에 대한 설명 : `@query`

4. 해당 api 가 github api와 연관있는 경우 그와 연관된 공식문서 링크 : `@githubRef`

5. 해당 api가 github api와 연관있는 경우, 그에 연관 있는 github api에 대한 설명 : `@github`
- 해당 github api의 API URL과 메서드
- (REST API의 경우) 해당 github api의 쿼리 파라미터에 대한 설명 
- (REST API의 경우) 해당 github api의 body에 보낼 수 있는 데이터
- (GraphQL의 경우) 해당 github api에서 사용하는 graphql 쿼리에 대한 설명

6. 해당 api가 github api와 연관 있는 경우, 해당 github api가 반환하는 데이터에 대한 설명 : `@githubresponse`
- 각 필드에 대해 설명해주세요

7. 해당 api가 반환하는 응답에 대한 설명 : `@response`
- data가 객체라면 각 필드에 대한 설명을 적습니다.
- 만약 어떤 필드가 github api에서 얻은 필드명을 그대로 쓴게 아닌 계산된 속성이면 (derived) 를 추가로 붙혀주세요
- github api 속성도, 유도된 계산 속성도 아닌 순수 우리 서버의 데이터와 연관된 속성이면 (original) 을 추가로 붙혀주세요
- 참고로 CommonResponse가 공통 응답 인데, data 필드에 대한 설명만 적으십쇼


8. 해당 api로 만들어질 수 있는 모든 에러에 대한 설명 : `@error`
- `[에러 번호] : 에러 사유` 로 작성해주세요

그리고 각 @ 필드는 서로 다른 필드의 경우 엔터로 구분되어있어야 합니다. (아래 예시 참고)

ex
```ts
/**
 * @api GET /api/search/test
 *
 * @desc 검색 입력값을 응답으로 돌려주는 테스트 라우트. 현재 GitHub API 호출은 연결 전이다.
 *
 * @query q (string) - 검색어.
 * @query page (string) - 검색 페이지
 * @query per_page (string) - 페이지당 가져올 갯수
 *
 * @githubRef https://docs.github.com/en/rest/search/search#search-users
 * @githubRef https://docs.github.com/en/rest/search/search#search-repositories
 *
 * ....
 * /
```


## API 개설과 관련된 타입 수칙

1. 모든 최종 응답은 `CommonResponse<T>` 타입으로 작성됩니다. 해당 타입에 대한 설명은 CommonResponse 파일에서 직접 확인하세요
2. 모든 최종 에러 응답은 `CommonErrorResponse` 타입으로 작성됩니다. 이를 위한 헬퍼 클래스 `CommonError` 도 존재하며, 필요에 따라 알아서 잘 사용하세요
3. github api와 관련된 api의 경우 다음의 절차를 걸쳐 타입을 만드세요
    3-1.
        (RESTAPI) 해당 github api에서 가져올 수 있는 정보(response)를 `RestEndpointMethodTypes`를 통해 다시 이름만 재명명해주세요. 이 때, 타입의 이름은
        `Github + Octokit 그룹 + 메서드 + Response`로 지으세요
        ex) 

        ```ts 
         await octokit.rest.search.users...
         => type GithubSearchUsersResponse
        ```

        (GraphQL) 쿼리와 응답 타입은 아래 **GitHub GraphQL 타입 생성 규칙**을 따르세요.
    3-2. 
        모든 타입 파일은 src/types 폴더 아래에 작성하며, 특히 github api와 직접적인 타입들은  types/github 폴더 아래에 작성합니다.
        REST API 타입은 `types/github/rest`에 두고, GraphQL 생성 타입은 `types/github/graphql`에 둡니다.
        RESTAPI의 파일 분리는 Octokit 그룹 & 메서드 로 나눠서 정리해주세요.
    3-3. 
        RESTAPI의 경우 파일명을 `Octokit그룹-메서드` 로 지으세요
        `ex) search.users 라면 search-users`
        Graphql은 그냥 알아서 잘 지으세요
    3-4. 
        인터페이스를 작성할 때에는 다음 설명 주석을 작성하세요
        - 해당 인터페이스에 대한 설명
        - 인터페이스의 각 필드가 의미하는 것을 필드 옆에 작성할 것

    3-5. 필드 타입을 지정할 때는 가능한 한 엄밀한 타입으로 선언하세요. 이게 무슨 말이냐면, 가령 type 같은 필드는 문자열이여도 들어올 수 있는 값이 한정되어있는 경우가 있는데, 이런 경우 or 연산자로 타입을 엄밀하게 좁혀주라는 의미입니다. 
    ```ts
    interface example{
        type : "users" | "repos"
    }
    ```

4. **최종 응답은 types/response 폴더 아래에 별도로 작성합니다.** 
    - 만약 최종 응답의 형태가 기존 github api의 부분 집합을 가져온 형태라면 `Pick<>` 문법을 사용해서 최종 응답 타입을 만들어주세요.
    - 단순히 Pick 문법으로 필요한 필드만 골라내는 완전한 부분집합 타입이면 `type`으로 정의하고, derived 필드나 original 필드가 새로 추가되어야 한다면 interface와 extend 문법으로 정의하세요.
    - 최종 응답은 다음과 같은 주석을 붙혀주세요
        - 해당 타입에 대한 간략한 설명
        - 해당 응답이 사용되어지는 우리 서버 api들
        - 각 필드마다의 설명, 추가로 derived 필드 또는 original 필드가 존재한다면 주석 설명에 (derived) 또는 (original)을 꼭 붙혀주세요
    - **그리고 이렇게 만든 최종 응답 data는 프론트엔드의 types 폴더에도 똑같은 이름의 타입을 만들어주세요. 다만, 여기서는 Pick을 쓰기보단 그냥 필요한 필드를 직접 인터페이스화 시켜서 작성하세요**

### GitHub GraphQL 타입 생성 규칙

- GitHub GraphQL API를 추가하거나 수정할 때 쿼리를 `src/client/queries/github/<기능>-<조회대상>.query.ts`에 분리합니다. 파일 하나에 이름이 있는 오퍼레이션 하나를 두고, 쿼리 문자열에 `/* GraphQL */`을 붙입니다.
- 쿼리를 추가하거나 변경한 뒤 `backend`에서 `npm run codegen`을 실행합니다. 생성 결과는 `src/types/github/graphql/operations.generated.ts`에 저장합니다.
- 호출부에서는 생성된 `*QueryVariables`로 요청 변수를 검사하고, `GithubGraphqlFetch<*Query>()`에 해당 쿼리의 생성 응답 타입을 전달합니다. GitHub 원본 응답 타입은 수기로 정의하지 않으며 생성 파일은 직접 수정하지 않습니다.
- 프론트엔드에 전달하는 서비스 응답 DTO는 기존 `types/response` 규칙에 따라 관리합니다.
