import CommonError from "./common-error";

/**
 * Tanstack query에서 공통적으로 사용하는 retry 함수입니다
 *.500 이상의 서버 오류가 발생했을 때, 최대 3회까지 재시도합니다.
 * 그 외의 경우에는 재시도하지 않습니다.
 * 
 * @param failureCount
 * @param error 
 * @returns boolean - whether to retry the request or not
 */
export const commonRetry = (failureCount: number, error : unknown) => {
    if(error instanceof CommonError && error.status >= 500 && failureCount < 3){
        return true;
    }

    return false; 
}