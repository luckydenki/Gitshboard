import ErrorSVG from "../render/ErrorSVG";
import CommonError from "./common-error";
import { isYYYYMMDD, isDateKebabCase, parseDateToKebabCase } from "./parseDate";
import { Response } from 'express';

export const readmeErrorResponseHandler =  (error:unknown, response:Response)=>{

    if(error instanceof CommonError){
        response.status(error.status).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
    }
    else if(error instanceof Error){
        const commonError = CommonError.create500Error(error.message, "/api/readme/commit-activity.svg");
        response.status(commonError.status).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
    }
    else{
        const commonError = CommonError.create500Error("Unknown error", "/api/readme/commit-activity.svg");
        response.status(commonError.status).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
    }
   

}


export const readmeErrorHandler = (error: unknown) => {
    if (error instanceof CommonError) {
        throw error;
    }
    else if (error instanceof Error) {
        throw CommonError.create500Error(error.message, "/api/readme/commit-activity.svg");
    }
    else {
        throw CommonError.create500Error("Unknown error", "/api/readme/commit-activity.svg");
    }
}




/**
 * isValidDateRange 메서드, 유효한 날짜 범위인지 확인하는 메서드입니다.
 * 
 * 1. from 과 to 중 올바른 날짜 범위가 아니면 false를 반환합니다. (ex: 2023-01-40, 2024-16-01 등)
 * 2. from이 to보다 이후이면 false를 반환합니다.
 * 3. from과 to 사이의 기간이 1년을 초과하면 false를 반환합니다.
 * 4. 모든 조건을 만족하면 true를 반환합니다.
 * 
 * @param from 
 * @param to 초기화할 to 날짜 문자열 (YYYYMMDD 형식)
 * @returns {boolean} - 유효한 날짜 범위인지 여부
 */
export const isValidDateRange = (from: string , to : string) : boolean =>{

    const fromData = new Date(from.substring(0, 4) + "-" + from.substring(4, 6) + "-" + from.substring(6, 8));
    const toData = new Date(to.substring(0, 4) + "-" + to.substring(4, 6) + "-" + to.substring(6, 8));

    if(Number.isNaN(fromData.getTime()) || Number.isNaN(toData.getTime())){
        return false;
    }
    else if(fromData.getTime() > toData.getTime()){
        return false;
    }
    else if(toData.getTime() - fromData.getTime() > 365 * 24 * 60 * 60 * 1000){
        return false;
    }
    return true;
}



/**
 * parameter로 들어온 from과 to를 초기화하는 메서드입니다.
 * 
 * 1. from과 to가 undefined이면 각각 30일 전과 오늘 날짜로 초기화합니다.
 * 2. from과 to가 YYYYMMDD 형식이면 그대로 반환합니다.
 * 3. from과 to가 YYYYMMDD 형식이 아니면 Error를 throw합니다.
 * 4. from 또는 to가 범위 바깥의 날짜이면 Error를 throw합니다.
 * 
 * @param paramsFrom 초기화할 from 날짜 문자열 (YYYYMMDD 형식)
 * @param paramsTo 초기화할 to 날짜 문자열 (YYYYMMDD 형식)
 * @returns { initFrom: string, initTo: string } - 초기화된 from과 to 날짜 문자열 (YYYYMMDD 형식)
 */
export const initParamsDate = (paramsFrom : string | undefined, paramsTo : string | undefined) => {

    if ((paramsFrom && !isYYYYMMDD(paramsFrom)) || (paramsTo && !isYYYYMMDD(paramsTo))) {
        throw Error("from과 to는 YYYYMMDD 형식이어야 합니다.");
    }


    const initIsoFrom = paramsFrom ? 
    new Date(paramsFrom.substring(0, 4) + "-" + paramsFrom.substring(4, 6) + "-" + paramsFrom.substring(6, 8)).toISOString() :
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();

    const initIsoTo = paramsTo ?
    new Date(paramsTo.substring(0, 4) + "-" + paramsTo.substring(4, 6) + "-" + paramsTo.substring(6, 8)).toISOString() :
    new Date().toISOString();

    if(Number.isNaN(new Date(initIsoFrom).getTime()) || Number.isNaN(new Date(initIsoTo).getTime())){
        throw Error("from과 to는 유효한 날짜여야 합니다.");
    }

    const initFrom = initIsoFrom.split("T")[0].replace(/-/g, '');
    const initTo = initIsoTo.split("T")[0].replace(/-/g, '');

    if(!isYYYYMMDD(initFrom) || !isYYYYMMDD(initTo)){
        throw Error("from과 to는 YYYYMMDD 형식이어야 합니다.");
    }
    
    return { initFrom, initTo };
}



/**
 * getUISize 메서드 (UI 크기 조정)
 * 
 * 1. width와 height는 각각 200~1500 사이의 값으로 제한됩니다.
 * 2. 그 이상 또는 그 이하의 값이 들어오면 각각 1500 또는 200, 100으로 조정됩니다.
 * 3. NaN이 들어도면 200과 100으로 조정됩니다.
 * 4. width와 height가 number 타입이 아니면 Error를 throw합니다.
 * 
 */
export const getUISize = (width: number, height: number) => {

    if(typeof width !== "number" || typeof height !== "number"){
        throw new Error("width와 height는 number 타입이어야 합니다.");
    }

    if (isNaN(width)) {
        width = 200;
    }
    if (isNaN(height)) {
        height = 100;
    }

    const newWidth = Math.max(Math.min(width, 1500), 200);
    const newHeight = Math.max(Math.min(height, 1500), 100);

    return { width: newWidth, height: newHeight };
}
    

/**
 * display될 from과 to를 설정하는 메서드로 YYYYMMDD 형식의 문자열을 받아 YYYY-MM-DD 형식으로 변환합니다.
 * 
 * @param from YYYYMMDD 형식으로 된 문자열
 * @param to YYYYMMDD 형식으로 된 문자열
 * @throws {Error} - 입력 값이 YYYYMMDD 형식이 아닌 경우
 * @returns { displayFrom: string, displayTo: string } - YYYY-MM-DD 형식으로 변환된 문자열
 */
export const getDisplayFromTo = (from : string, to : string) => {

    if(!/^\d{8}$/.test(from) || !/^\d{8}$/.test(to)){
        throw new Error("from과 to는 YYYYMMDD 형식이어야 합니다.");
    }
    const displayFrom = parseDateToKebabCase(from);
    const displayTo = parseDateToKebabCase(to);

    return { displayFrom, displayTo };
}

/**
 * 실제 Github API 요청에 사용될 from과 to를 설정하는 메서드로 
 * YYYYMMDD 또는 YYYY-MM-DD 형식의 문자열을 받아 ISO 형식으로 변환합니다.
 * 단, from은 0시 0분 0초, to는 23시 59분 59초로 설정됩니다.
 * 
 * @param from YYYYMMDD 형식으로 된 문자열
 * @param to YYYYMMDD 형식으로 된 문자열
 * @param options from과 to의 시간을 설정할 수 있는 옵션 객체. fromHour와 toHour를 설정할 수 있습니다.
 * @throws {Error} - 입력 값이 YYYYMMDD 또는 YYYY-MM-DD 형식이 아닌 경우
 * @returns { isoFrom: string, isoTo: string } - ISO 형식으로 변환된 문자열
 */
export const getISOFromTo = (from : string, to : string, options : {
    fromHour? : number,
    toHour? : number
}) => {

    if(!isYYYYMMDD(from) && !isDateKebabCase(from) || 
    !isYYYYMMDD(to) && !isDateKebabCase(to)){
        throw new Error("from과 to는 YYYYMMDD 또는 YYYY-MM-DD 형식이어야 합니다.");
    }

    let isoFrom : string;
    let isoTo : string;

    if(from.includes("-") || to.includes("-")){
        isoFrom = new Date(new Date(from).setHours(options.fromHour ?? 0, 0, 0, 0)).toISOString();
        isoTo = new Date(new Date(to).setHours(options.toHour ?? 23, 59, 59, 999)).toISOString();
    }
    else{
        isoFrom = new Date(new Date(parseDateToKebabCase(from)).setHours(options.fromHour ?? 0, 0, 0, 0)).toISOString();
        isoTo = new Date(new Date(parseDateToKebabCase(to)).setHours(options.toHour ?? 23, 59, 59, 999)).toISOString();
    }

    return { isoFrom, isoTo };
}