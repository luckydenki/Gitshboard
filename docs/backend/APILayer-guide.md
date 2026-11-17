# APILAYER GUIDE

이 문서는 API를 생성할 때 로직을 어떻게 레이어를 두고 분할할지에 대한 규칙을 설명합니다.

## 공통 사안

1. 백엔드 레이어는 크게 `routes` `controllers` `services` `client` `repository` `util`로 나뉩니다.

2. routes는 라우팅만 담당합니다. 미들웨어의 흐름과 최종적으로는 controller로직을 넣습니다.

3. controller는 요청을 받고 응답을 수행하는 역할만 담당합니다. 
    - 요청이라는 것은 req.query를 통해 쿼리를 바깥으로 꺼내는 것까지 의미합니다.
    - 응답이라는 것은 정상 응답 및 에러 처리를 의미합니다.

4. service는 실제 서비스 로직을 구현하고 수행하여 응답을 만드는 게 아닌 응답이 될 **데이터**를 내려보내는 역할을 담당합니다.

5. client는 외부 서비스, 외부 시스템 API와 교류하는 로직을 수행합니다. 응답을 서비스에서 필요로 하는 형태로 가공할 수 있습니다 (가공 허용 범위는 아래 참고)

6. repository는 우리 서비스의 DB나 저장소와 교류하는 로직을 수행합니다. 응답을 서비스에서 필요로 하는 형태로 가공할 수 있습니다 (가공 허용 범위는 아래 참고)

7. util은 서비스 로직을 짜면서 매우 길어지는 기능 코드나 반복 재사용되는 코드를 묶어 함수화 하는 역할을 담당합니다.



## 분리 규칙

현재 api는 크게 `routes`와 `controllers`, `services`, `client`, `repository` 로 나뉩니다.

1. routes는 controllers를 호출하고 더 이상 무언가를 하지 마세요

2. controllers의 책임은 필요한 파라미터를 가져오고, 최종 에러와 응답을 호출하며 필요한 서비스를 호출하는 작업만 수행하면 됩니다.

3. services는 controllers에 담을 수 없는 나머지 실제 서비스 로직들이 들어가면 됩니다.

4. controllers와 services의 이름은 route의 도메인을 따서 만듭니다. 예를 들어, routes 파일 이름이 `repo.routes.ts`라면
controllers는 `repo.controllers.ts` services는 `repo.services.ts`입니다.

5. controllers와 services는 클래스로 만들고, `export default` 문법으로 모듈을 export 시키세요. 클래스명은 `도메인명`+Controllers 또는 `도메인명`+Services 로 짓습니다.

6. client는 주로 github, 또는 우리 서버 db가 아닌 외부 api를 호출하는 로직을 담습니다. 이 프로젝트는 주로 github api를 다루고 있으니 github api 호출 관련 로직을 분리할 때 쓰면 됩니다.

7. client 로직은 다음을 지켜야 합니다.
- 하나의 client 메서드는 하나의 api만 호출한다.
- 하나의 client 메서드는 반환된 api의 응답을 그대로 반환한다.
- 하나의 client 메서드에서 발생한 에러 또한 CommonErrorResponse 형태로 바꿔 반환한다.
- grpahql 은 `GithubGraphqlFetch<T>` 함수로 호출하고, REST는 `ocktokit`으로 호출한다.

8. client의 클래스명은 github api의 경우 `Github(도메인)Client` 라고 이름을 지으세요. 

9. 발생 가능한 에러는 그 위치에서 바로바로 `CommonErrorResponse`를 만들어서 throw 시키세요. 단, 하위 계층에서 이미 만들어 준 CommonErrorResponse가 있다면 이를 재가공하지말고 그냥 그대로 throw 시켜주세요. 즉 그 계층에서 생길 수 있는 에러만 추가해서 CommonErrorResponse로 바꾸시면 됩니다.이후 최종 에러 응답 처리는 Controller에서 책임지면 됩니다.

10. util은 말 그대로 구현 중 반복 사용되는 조건 확인 정규식이나 너무 긴 기능 로직을 분리할 때 사용합니다.
- controller, service 등 계층을 구분하지 않고 모아둡니다
- 특정 도메인 안에서만 존재하는 함수라면 `/backend/src/utils/routes` 폴더 아래에 도메인 별로 모아두세요
- 특정 도메인을 떠나서 범용적으로 쓰이는 함수라면 `/backend/src/utils` 바로 아래에 작성하세요. 파일명은 `(도메인명).utils.ts`입니다.
- 특정 도메인에서만 쓰는 util들은 `도메인명 + Utils` 이라는 클래스로 묶어서 관리하고 export default 하여 export 시키세요
- util 함수는 의존적이지 않는 순수 함수여야 합니다.
- util 함수는 반드시 각 함수가 무슨 동작을 하고 어떤 파라미터를 받고 어떤 걸 반환하는지 설명 주석을 추가해야 합니다.