import { beforeEach, describe, expect, it, vi } from "vitest";
import { commonRetry } from "../app/utils/tanstackUtil";


describe("commonRetry",()=>{

    it("만약 응답 요청이 500이상의 에러 코드가 온다면, 3회까지 재시도합니다.", ()=>{
        const error = { status: 500 };
        expect(commonRetry(0, error)).toBe(true);
        expect(commonRetry(1, error)).toBe(true);
        expect(commonRetry(2, error)).toBe(true);
        expect(commonRetry(3, error)).toBe(false);
    })

    it("만약 응답 요청이 500미만의 에러 코드가 온다면, 재시도하지 않습니다.", ()=>{
        const error = { status: 400 };
        expect(commonRetry(0, error)).toBe(false);
        expect(commonRetry(1, error)).toBe(false);
        expect(commonRetry(2, error)).toBe(false);
        expect(commonRetry(3, error)).toBe(false);
    })

})
