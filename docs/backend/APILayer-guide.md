# APILAYER GUIDE

이 문서는 API를 생성할 때 로직을 어떻게 레이어를 두고 분할할지에 대한 규칙을 설명합니다.

## 공통 사안

1. 백엔드 레이어는 크게 `routes` `controllers` `services` `client` `repository` `util` `processor` `mapper` 로 나뉩니다.

2. routes는 라우팅만 담당합니다. 미들웨어의 흐름과 최종적으로는 controller로직을 넣습니다.

3. controller는 요청을 받고 응답을 수행하는 역할만 담당합니다. 
    - 요청이라는 것은 req.query를 통해 쿼리를 바깥으로 꺼내는 것까지 의미합니다.
    - 응답이라는 것은 정상 응답 및 에러 처리를 의미합니다.

4. service는 실제 서비스 로직을 구현하고 수행하여 응답을 만드는 게 아닌 응답이 될 **데이터**를 내려보내는 역할을 담당합니다.

5. client는 외부 서비스, 외부 시스템 API와 교류하는 로직을 수행합니다. 응답을 서비스에서 필요로 하는 형태로 가공할 수 있습니다 (가공 허용 범위는 아래 참고)

6. repository는 우리 서비스의 DB나 저장소와 교류하는 로직을 수행합니다. 응답을 서비스에서 필요로 하는 형태로 가공할 수 있습니다 (가공 허용 범위는 아래 참고)

7. mapper는 말 그대로 데이터 매핑을 담당합니다. 원천 데이터를 다른 명칭 또는 다른 속성으로 바꿔서 우리 서비스 계약에 맞게 바꿔야 하는 경우에 사용합니다.

8. process는 원천 데이터를 바탕으로 유도 데이터, 계산 데이터를 만들어야 하는 경우 담당합니다. 

9. util은 로직을 짜며 다음 부류들을 분리할 때 씁니다. 이곳 저곳에서 유틸리티 성격으로 사용되는 함수들 또는 특정 도메인에서 자주 쓰는 일반적인 순수 함수들을 모아놓습니다. 보통 검증 함수들도 여기에 놓습니다. (추후 zod 도입으로 이 정책은 바뀔 예정)


## 분리 규칙

### 주 레이어

일반적인 흐름은 `routes` -> `controllers` -> `services` -> `client`/`repository` 로 나뉩니다.

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


### 부가 레이어

부가적인 레이어는 `utils`, `mapper`, `process`로 나뉩니다. 필요할 때 주 레이어에서 갖다 쓰는 방식입니다.

- 해당 레이어들의 함수는 각 함수가 무슨 동작을 하고 어떤 파라미터를 받고 어떤 걸 반환하는지 설명 주석을 추가해야 합니다.
- 해당 레이어들의 함수는 순수 함수여야 합니다.
- 해당 레이어들의 함수는 클래스 멤버 메서드인 경우 public static으로 작성해서 호출하세요
- **해당 레이어들은 필수 레이어가 아니며, 과추상화를 방지하기 위해 코드가 매우 길어지는 상황 또는 코드가 반복되어 사용되는 게 아니라면 그냥 주 레이어에서 처리하세요**

1. `util`은 말 그대로 구현 중 반복 사용되는 유틸리티 로직, 조건 확인을 위한 정규식 등을 모아둡니다.
- 특정 도메인 안에서만 존재하는 함수라면 `/backend/src/utils/routes` 폴더 아래에 도메인 별로 모아두고, 해당 `도메인+Utils`로 클래스로 관리하세요. 파일명은 `(도메인명).utils.ts`입니다.
- 특정 도메인을 떠나서 범용적으로 쓰이는 함수라면 `/backend/src/utils/common` 아래에 작성하고 이건 클래스로 관리하지말고 그냥 모듈 하나하나로 관리하세요

2, `mapper`는 원천 데이터를 우리 서비스가 사용하는 규격에 맞게 바꿔야 할 때 사용합니다.
- 데이터를 다른 속성으로 바꾸거나, 아니면 다른 방식으로 전환하는 수준에서는 mapping 을 사용합니다.
- `(도메인명).mapper.ts`으로 `Mapper`라는 Suffix를 붙혀 클래스를 만드세요

3. `process`는 원천 데이터를 다른 의미를 가진 데이터로 바꾸는 로직을 모아둡니다.
- 예를 들어 커밋 합산, 가장 많이 커밋한 날 등 직접 얻을 수 없고 계산을 통해 유도해야 하는 데이터들을 계산합니다.
- `(도메인명).process.ts`으로 `Process`라는 Suffix를 붙혀 클래스를 만드세요