# APICreate GUIDE

해당 문서는 API를 개설해달라고 하는 모든 요청에 대한 지침입니다.

(임시 규칙입니다. 이 규칙은 변경될 수 있으며, 우선은 controller나 service 파일로 분리시키지 말고 routes 파일 안에 모두 작성하세요)


## 공통 규칙
- 모든 최종 응답은 `CommonResponse<T>` 타입으로 작성됩니다. 해당 타입에 대한 설명은 CommonResponse 파일에서 직접 확인하세요
- 모든 최종 에러 응답은 `CommonErrorResponse` 타입으로 작성됩니다. 이를 위한 헬퍼 클래스 `CommonError` 도 존재하며, 필요한 경우에 잘 사용해보세요.


## 생성 규칙


1. 이 서비스의 api는 github api를 호출하여 그것을 정제하여 내려보내는 api와 순수한 우리 서버의 서비스 및 기능을 수행하는 api로 나뉩니다. 여기서 전자 타입을 "github service" 후자 타입을 "server service"로 약칭합니다.

2. 모든 응답은 `CommonResponse<T>`로, 모든 에러는 `CommonErrorResponse`로 작성하여 보냅니다.

3. github service는 항상 다음과 같은 절차로 response를 받아오세요
    2-1. github api를 octokit으로 호출하세요.
    2-2. graphql의 경우 `GithubGraphqlFetch<T>`함수를 사용하여 호출하세요
    2-3. graphql방식의 경우 - 응답 객체를 그냥 `response` 라고 받아오세요
        rest방식의 경우 - 응답 객체를 `{data : response}` 라고 받아오세요
        만약 호출하는 api가 여러가지면 `(적당히 직관적인 이름)_response`로 지으세요.
    2-6. 최종 CommonResponse로 만들 때 그 변수이름은 항상 `commonResponse`로, 그 안에 들어가는 data는 `data`라는 이름으로 새로 만들어서 대입시키세요

활용 예시 (graphql)
```ts
    const response = await GithubGraphqlFetch....  //graphql 방식
    
    const data  :UserInfo = {
       // ...response는 github graphql 규약이므로 우리 서버 규약에 맞게 적당히 대입해주시면 됩니다.
       //만약 완전히 동일하다면 그냥 data = response라고 해주시면 됩
    }

    const commonResponse : CommonResponse<UserInfo> = {
        status : 200,
        success : true,
        data
    }

    res.json(commonResponse)
```

(rest 예시)

```ts
    const { data : response }  = await octokit(...)  //rest 방식
    
    const data  :UserInfo = {
       // ...response는 github rest의 규약이므로 우리 서버 규약에 맞게 적당히 대입해주시면 됩니다.
       //만약 완전히 동일하다면 그냥 data = response라고 해주시면 됨
    }

    const commonResponse : CommonResponse<UserInfo> = {
        status : 200,
        success : true,
        data
    }

    res.json(commonResponse)
```


4. 에러 로직을 작성할 때는 발생 가능한 모든 에러 상황을 분석하여 알아서 판단하여 분기를 나누고, 이를 CommonErrorResponse로 치환시킨 후 `res.status().json()`문법으로 에러를 보내세요. 이때 상세 내용들은 모두 **한글**로 작성하는 것을 원칙으로 합니다.

- 이 에러 상황을 만들 때는 타입, 값의 범위 조건에 의한 오류뿐만 아니라, github api 호출에서 발생 가능한 에러 상황도 관리하셔야 합니다.


5. 모든 파라미터들은 구조 분해로 가져오세요 아래를 참고하시면 됩니다.

ex)
```ts
const { a, b, c } = req.query;
```

6. API를 개설 요청할 땐 반드시 다음 정보가 수반되어야 합니다.
    - CommonResponse의 데이터의 타입, 또는 어떤 객체나 데이터가 와야 하는지에 대한 정보
    - api 경로 이름과 메서드
    - (필요한 경우) api에 사용되는 쿼리 파라미터의 정보, 없으면 없다고 할 것
    - (POST, PUT, PATCH의 경우) api에 올라오는 요청 body, 없으면 없다고 할 것

이 정보가 제대로 제공되지 않는다면 작업을 수행하지 말고 요청자에게 물어보거나 추가적인 요청자의 조건을 확인해보시길 바랍니다.
GitHub GraphQL을 사용하는 API에서 서버 DTO만 생략됐다면, Codegen 응답 타입을 서버 DTO 이름으로 별칭을 붙여 사용하세요. 서버 DTO가 명시됐다면 해당 계약을 따르세요. 자세한 내용은 [API 타입 가이드](./APIType-guide.md#서버-dto)를 참고하세요.



