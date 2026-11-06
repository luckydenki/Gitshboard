# BACKEND AGNETS.md

먼저 루트 [AGENTS.md](../AGENTS.md)를 읽고 기본 지침은 이해하고 오세요.
이 문서는 백엔드 agents.md입니다.


## API 개설 규칙

(임시 규칙입니다. 이 규칙은 변경될 수 있으며, 우선은 controller나 service 파일로 분리시키지 말고 routes 파일 안에 모두 작성하세요)

1. 이 서비스의 api는 github api를 호출하여 그것을 정제하여 내려보내는 api와 순수한 우리 서버의 서비스 및 기능을 수행하는 api로 나뉩니다. 여기서 전자 타입을 "github service" 후자 타입을 "server service"로 약칭합니다.

2. 모든 응답은 `CommonResponse<T>`로, 모든 에러는 `CommonErrorResponse`로 작성하여 보냅니다.

3. github service는 항상 다음과 같은 절차로 response를 받아오세요
    2-1. github api를 fetch로 호출합니다.
    2-2. 그것으로 받아온 응답객체는 `response`라고 이름을 짓습니다. 만약 호출하는 github api가 여러가지라면 `(적당히 직관적인 이름)_response`로 지으세요
    2-3. response는 반드시 `.ok`로 체크해야 하며, false인 상황은 throw 시키세요.
    2-4. response의 데이터를 `.json()`하는 경우 그 객체의 이름을 json 이라 이름을 지으세요. 만약 여러개의 json이라면 `(적당히 직관적인 이름)_json`으로 지으세요
    2-5. (API와 관련된 타입 수칙 참고) 해당 json은 **모든** 정보가 담긴 인터페이스 타입으로 사용하세요. (변수의 타입을 그렇게 선언하면 됨)
    2-6. 최종 CommonResponse로 만들 때 그 변수이름은 항상 `commonResponse`로, 그 안에 들어가는 data는 `data`라는 이름으로 새로 만들어서 대입시키세요

활용 예시
```ts
    const response = await fetch("깃허브 api주소",{
        'Accept':"application/vnd.github+json"
    });

    if(!response.ok){
        throw new Error("에러 메세지")
    }

    const json : GithubUserResponse = await response.json();
    
    const data  :UserInfo = {
       // ...json.(필요한 필드)
    }

    const commonResponse : CommonResponse<UserInfo> = {
        status : 200,
        success : true,
        data
    }

    res.json(commonResponse)
```

4. 에러 로직을 작성할 때는 발생 가능한 모든 에러 상황을 분석하여 알아서 판단하여 분기를 나누고, 이를 CommonErrorResponse로 치환시킨 후 `res.status().json()`문법으로 에러를 보내세요. 이때 상세 내용들은 모두 **한글**로 작성하는 것을 원칙으로 합니다.

5. API를 개설 요청할 땐 반드시 다음 정보가 수반되어야 합니다.
    - CommonResponse의 데이터의 타입, 또는 어떤 객체나 데이터가 와야 하는지에 대한 정보
    - api 경로 이름과 메서드
    - (필요한 경우) api에 사용되는 쿼리 파라미터의 정보, 없으면 없다고 할 것
    - (POST, PUT, PATCH의 경우) api에 올라오는 요청 body, 없으면 없다고 할 것

이 정보가 제대로 제공되지 않는다면 작업을 수행하지 말고 요청자에게 물어보거나 추가적인 요청자의 조건을 확인해보시길 바랍니다.




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
        (RESTAPI) 해당 github api에서 가져올 수 있는 **모든** 정보를 인터페이스 화 시키고 이를 별도의 타입 파일로 분리시키세요.
        (GraphQL) 해당 쿼리를 통해 가져오게 되는 **모든** 정보를 인터페이스 화 시키고 별도의 타입 파일로 분리시키세요
    3-2. 
        모든 타입 파일은 src/types 폴더 아래에 작성하며, 특히 github api와 직접적인 타입들은  types/github 폴더 아래에 작성합니다.
        만약 RESTAPI의 타입이라면 github/rest 폴더 아래에, graphql 쿼리로 만들어진 거라면 github/graphql 폴더 아래에 작성해주세요.
    3-3. 
        파일명은 알아서 잘 직관적으로 작성해주세요
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

        