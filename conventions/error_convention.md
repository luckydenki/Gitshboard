# Backend Error Convention

## 기본 규칙

- 모든 error는 에러 발생 발원지에서 바로 ErrorCommonResponse를 작성한다.
- 반드시 모든 에러에 대한 적절한 대응책이 있어야 한다.
- 모든 네트워크 비정상 응답은 곧바로 catch 되며, 이 또한 catch 문에서 CommonErrorResponse로 바꿔야 한다.

## 백엔드 에러 규칙

1. 모든 에러의 최종적인 처리는 controller의 catch에서 이루어져야 한다.
2. controller 이외의 곳에서 발생하는 모든 에러는 throw로 에러의 책임을 위임해야 한다.
3. catch에서 `Error`객체 그 자체가 넘어왔거나, 네트워크 단절, 백엔드 내부 로직 오류 등의 예기치 못한 오류는 500을 뱉어야 한다.


## 프론트엔드 에러 규칙

1. 백엔드에서 오는 모든 비정상 응답은 `!res.ok` 를 통해 구분하며, 이 에러 객체를 json 화 시켜서 던져야 한다.
2. 모든 에러 상황을 고려한 에러 Fallback UI를 만들어야 한다.


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

필요한 경우 추가 필드를 만들 수 있다.

export interface CommonErrorResponse {
    ...

    errorCode : string // 정확히 어떤 에러인지에 대한 코드
}

```

## 프론트엔드 에러 상황에 대한 대처 (아직은 미흡한 상태)

1. 401 : 인증되지 않음
- 재시도 없음
- 인증 권한 문제이며 이는 queryClient의 공통 처리에 따라 로그인 화면으로 보내야 한다.

2. 403 : 권한 없음
- 재시도 없음
- 사용 권한 문제이며 그냥 상황에 맞게 대처하면 됨

3. 404 : 리소스 없음
- 재시도 없음
- 페이지 미존재의 경우 404 페이지로 리다이렉팅 시킨다.
- 입력폼에서 존재하지 않는 값의 의미라면 적절한 팝업이나 메세지로 대처한다.

4. 429 : 요청 한도 초과
- 재시도 없음
- 요청 한도가 초과되었다는 팝업 문구와 함께 다시 요청 한도가 돌아오는 1분의 카운트 ux가 필요하다.

5. 500 이상 오류들
- 3회 재시도
- 보통 서버에 에러가 발생한 경우의 문제이며,5회 모두 실패한 경우 500 에러 페이지 리다이렉트를 해준다.
