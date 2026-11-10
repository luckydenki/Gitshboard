# APICreate GUIDE

해당 문서는 API를 개설해달라고 하는 모든 요청에 대한 지침입니다.

(임시 규칙입니다. 이 규칙은 변경될 수 있으며, 우선은 controller나 service 파일로 분리시키지 말고 routes 파일 안에 모두 작성하세요)


1. 이 서비스의 api는 github api를 호출하여 그것을 정제하여 내려보내는 api와 순수한 우리 서버의 서비스 및 기능을 수행하는 api로 나뉩니다. 여기서 전자 타입을 "github service" 후자 타입을 "server service"로 약칭합니다.

2. 모든 응답은 `CommonResponse<T>`로, 모든 에러는 `CommonErrorResponse`로 작성하여 보냅니다.

3. github service는 항상 다음과 같은 절차로 response를 받아오세요
    2-1. github api를 octokit으로 호출하세요.
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



