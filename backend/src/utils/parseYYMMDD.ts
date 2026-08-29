import CommonError from "./common-error"

/**
 * YYMMDD 형식의 문자열을 YYYY-MM-DD 형식으로 변환합니다.
 * 
 * @throws Error - 입력 값이 YYMMDD 형식이 아닌 경우
 * 
 * @param value 
 * @returns 
 */
export const parseYYMMDD = (value : string) : string => {
    if (!/^\d{8}$/.test(value)) {
        throw new CommonError({
            status: 400,
            title: "Bad Request",
            type: "https://docs.github.com/en/graphql/overview/explorer",
            detail: "입력 값은 YYMMDD 형식이어야 합니다.",
            instance: "/api/readme/commit-activity.svg"
        });
    }

    const year = value.substring(0, 4)
    const month = value.substring(4, 6)
    const day = value.substring(6, 8)

    const date = `${year}-${month}-${day}`;

    return date;
}