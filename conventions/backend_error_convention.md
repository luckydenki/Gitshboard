# Backend Error Convention

## 기본 규칙

1. error는 에러 발생 발원지에서 바로 ErrorCommonResponse를 작성한다.
2. 에러의 최종적인 처리는 controller의 catch에서 이루어져야 한다.
3. controller 이외의 곳에서 발생하는 모든 에러는 throw로 에러의 책임을 위임해야 한다.
4. catch에서 `Error`객체 그 자체가 넘어왔거나, 네트워크 단절, 백엔드 내부 로직 오류 등의 예기치 못한 오류는 500을 뱉어야 한다.


## ErrorCommonResponse 양식

RFC-9457 에러 응답 제안을 참고하였으며, 필드는 다음과 같다.

```ts

export interface CommonErrorResponse{
    type : string;      // 해당 오류와 관련된 문서화 링크
    title : string;     // 간단한 제목
    status : ErrorStatus;   //에러 코드
    detail? : string;   // 상세 설명
    instance? : string; // 오류가 발생 식별용 인스턴스(URI), 보통 요청 경로를 씀
}

```
