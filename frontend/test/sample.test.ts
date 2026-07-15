import { describe, it, expect } from "vitest";

// 시험용 vitest 코드


describe("Sample Test", ()=>{

    it("should return true", ()=>{
        console.log("Sample Test");
        expect(true).toBe(true);
    })

    it("should return false", ()=>{
        console.log("Sample Test2");
        expect(false).toBe(false);
    })


})
