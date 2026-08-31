import CommonError from "./common-error"



export const isYYYYMMDD = (value : string) : boolean => {
    return /^\d{8}$/.test(value);
}


export const isDateKebabCase = (value : string) : boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}



/**
 * YYYYMMDD 형식의 문자열을 YYYY-MM-DD 형식으로 변환합니다.
 * 
 * @throws {Error} - 입력 값이 YYYYMMDD 형식이 아닌 경우
 * @param value 
 * @returns 
 */
export const parseDateToKebabCase = (value : string) : string => {
    if (!isYYYYMMDD(value)) {
        throw new Error("입력 값이 YYYYMMDD 형식이 아닙니다.");
    }

    const year = value.substring(0, 4)
    const month = value.substring(4, 6)
    const day = value.substring(6, 8)

    const date = `${year}-${month}-${day}`;

    return date;
}


/** 
 * YYYY-MM-DD 형식의 문자열을 YYYYMMDD 형식으로 변환합니다.
 *
 * @throws {Error} - 입력 값이 YYYY-MM-DD 형식이 아닌 경우
 * @param value 
 * @returns {string} - 변환된 YYYYMMDD 형식의 문자열

*/
export const parseDateToYYYYMMDD = (value : string) : string => {
    if (!isDateKebabCase(value)) {
        throw new Error("입력 값이 YYYY-MM-DD 형식이 아닙니다.");
    }

    const year = value.substring(0, 4)
    const month = value.substring(5, 7)
    const day = value.substring(8, 10)

    const date = `${year}${month}${day}`;

    return date;
}
