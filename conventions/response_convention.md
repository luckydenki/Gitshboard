# Response Convention

## 기본 규칙

1. 모든 응답은 CommonResponse 규격에 맞춰서 작성해야 한다. (백엔드, 프론트엔드 모두)
2. controller가 아닌 모든 하위 처리들의 정상 처리는 return 으로 필요한 데이터만 내려보내야 한다.
3. CommonResponse 응답은 반드시 controller에서 응답 직전에 작성해야 한다.
4. 모든 응답은 타입을 만들어야 한다. 프론트엔드, 백엔드 모두 같은 이름으로 타입으로 만든다.


## CommonResponse 규격

흔히 쓰이는 응답 규격을 사용하였음.

```ts
export interface CommonResponse<T>{
    success : boolean;
    status : SuccessStatus;
    data? : T;
}

```