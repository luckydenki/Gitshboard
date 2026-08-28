import { describe, expect, it } from "vitest";
import { commonRetry } from "../app/utils/tanstack-utils";
import CommonError from "../app/utils/common-error";


describe("commonRetry",()=>{

    it("만약 응답 요청이 500이상의 에러 코드가 온다면, 3회까지 재시도합니다.", ()=>{
        const error = new CommonError({
            status : 500,
            title : "Internal Server Error",
            type : "InternalServerError",
            detail : "An internal server error occurred."
        })
        expect(commonRetry(0, error)).toBe(true);
        expect(commonRetry(1, error)).toBe(true);
        expect(commonRetry(2, error)).toBe(true);
        expect(commonRetry(3, error)).toBe(false);
    })

    it("만약 응답 요청이 500미만의 에러 코드가 온다면, 재시도하지 않습니다.", ()=>{
        const error = new CommonError({
            status : 400,
            title : "Bad Request",
            type : "BadRequest",
            detail : "The request could not be understood by the server due to malformed syntax."
        });
        expect(commonRetry(0, error)).toBe(false);
        expect(commonRetry(1, error)).toBe(false);
        expect(commonRetry(2, error)).toBe(false);
        expect(commonRetry(3, error)).toBe(false);
    })

})
