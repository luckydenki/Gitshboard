import CommonError from "./common-error";



export class TanstackKeyFactory{

    private key_map = new Map<string, string[]>();

    constructor(){

    }

    /**
     * setKey는 url을 기반으로 query key를 생성한다.
     * 
     * 1. 일반 url의 경우 / 단위로 쪼갠뒤, 이를 -로 연결하여 query key를 생성하고 0번째 요소로 붙인다.
     * 2. query parameter의 경우 ? 뒤의 parameter를 query key의 1번째 요소로 사용한다.
     * 3. 단, 공통 prefix인 "api"는 제거한다.
     * 
     * @example 
     * 
     * @param url 
     * @returns 
     */
    setKey(url:string){

        const urlSplit = url.split("/").filter(segment => segment !== "api");
        const queryParams = urlSplit.at(-1)?.split("?")?.at(1);
        const lastSegment = urlSplit.at(-1)?.split("?")?.at(0);

        urlSplit[urlSplit.length-1] = lastSegment ? lastSegment : urlSplit[urlSplit.length-1];

        const url_key = urlSplit.reduce((acc, cur)=>{
            if(acc === ""){
                return cur;
            }
            return acc +"-"+cur;
        }, "");

        //console.log("url_key", url_key);

        const key_array = [url_key];
        if(queryParams){
            key_array.push(queryParams);
        }

       this.key_map.set(url, key_array);
    }


    getKey(url:string) : string[] | undefined{
        return this.key_map.get(url);
    }


}



/**
 * Tanstack query에서 공통적으로 사용하는 retry 함수입니다
 *.500 이상의 서버 오류가 발생했을 때, 최대 3회까지 재시도합니다.
 * 그 외의 경우에는 재시도하지 않습니다.
 * 
 * @param failureCount
 * @param error 
 * @returns boolean - whether to retry the request or not
 */
export const commonRetry = (failureCount: number, error: any) => {

    if(error instanceof CommonError && error.status >= 500 && failureCount < 3){
        return true;
    }

    return false; 
}