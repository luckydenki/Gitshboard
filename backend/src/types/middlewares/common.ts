/**
 * GitHub API에서 받아오는 사용자 정보의 타입을 정의하는 인터페이스입니다.
 * Github API상 모든 응답은 공통적으로 data 필드 안에 담깁니다
 * 
 */
export interface GithubCommonResponse<T> {
    data: T
}


export type SuccessStatus = 200 | 201 | 202 | 204 | 206 | 207 | 208 | 226;

export type ErrorStatus = 400 | 401 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 503;



/**
 * 현재 중간자 백엔드에서 프론트엔드로 넘길 때 공통적으로 사용할 
 * 응답 타입을 정의하는 인터페이스입니다.
 */
export interface CommonResponse<T>{
    success : boolean;
    status : SuccessStatus;
    data? : T;
}


/**
 * 현재 중간자 백엔드에서 프론트엔드로 넘길 때 공통적으로 사용할 
 * 에러 응답 타입을 정의하는 인터페이스입니다.
 * 
 * RFC-9457 참고 규격
 * 
 */
export interface CommonErrorResponse{
    type : string;      // 해당 오류와 관련된 문서화 링크
    title : string;     // 간단한 제목
    status : ErrorStatus;
    detail? : string;   // 상세 설명
    instance? : string; // 오류가 발생 식별용 인스턴스(URI), 보통 요청 경로를 씀
}