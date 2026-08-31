import { describe, expect, it } from "vitest";
import { getUISize, getDisplayFromTo, initParamsDate } from "../utils/readme.util";


// readmeService.setUISize

/**
 * setUISize 메서드
 * 
 * 1. width와 height는 각각 200~1500 사이의 값으로 제한됩니다.
 * 2. 그 이상 또는 그 이하의 값이 들어오면 각각 1500 또는 200, 100으로 조정됩니다.
 * 3. NaN이 들어도면 200과 100으로 조정됩니다.
 * 
 */
describe("Readme getUISize", ()=>{

    it("Normal case : 범위 내 값을 넣으면 그대로 반환" , ()=>{
        const result = getUISize(500, 300);
        expect(result).toEqual({ width: 500, height: 300 });
    })

    it("Edge case : width 가 1500보다 크면 1500으로 조정" , ()=>{
        const result = getUISize(2000, 300);
        expect(result).toEqual({ width: 1500, height: 300 });
    })

    it("Edge case : width 가 200보다 작으면 200으로 조정" , ()=>{
        const result = getUISize(100, 300);
        expect(result).toEqual({ width: 200, height: 300 });
    })

    it("Edge case : height 가 1500보다 크면 1500으로 조정" , ()=>{
        const result = getUISize(500, 2000);
        expect(result).toEqual({ width: 500, height: 1500 });
    })

    it("Edge case : height 가 100보다 작으면 100으로 조정" , ()=>{
        const result = getUISize(500, 50);
        expect(result).toEqual({ width: 500, height: 100 });
    })

    it("Edge case : width 가 NaN이면 200으로 조정" , ()=>{
        const result = getUISize(NaN, 300);
        expect(result).toEqual({ width: 200, height: 300 });
    })

    it("Edge case : height 가 NaN이면 100으로 조정" , ()=>{
        const result = getUISize(500, NaN);
        expect(result).toEqual({ width: 500, height: 100 });
    })

    it("Error case : width와 height가 number 타입이 아니면 Error를 throw" , ()=>{
        expect(()=>getUISize("500" as unknown as number, 300)).toThrow("width와 height는 number 타입이어야 합니다.");
        expect(()=>getUISize(500, "300" as unknown as number)).toThrow("width와 height는 number 타입이어야 합니다.");
    })

})



describe("Readme getDisplayFromTo", ()=>{

    it("Normal case : 정상적인 yyyymmdd는 yyyy-mm-dd로 변환" , ()=>{
        const result = getDisplayFromTo("20230101", "20230131");
        expect(result).toEqual({ displayFrom: "2023-01-01", displayTo: "2023-01-31" });
    })

    it("Error case : yyyymmdd가 어느 한쪽이라도 아닌 경우 에러 발생" , ()=>{
        expect(()=>getDisplayFromTo("2023-01-01", "20230131")).toThrow("from과 to는 YYYYMMDD 형식이어야 합니다.");
        expect(()=>getDisplayFromTo("20230101", "2023-01-31")).toThrow("from과 to는 YYYYMMDD 형식이어야 합니다.");
        expect(()=>getDisplayFromTo("2023-01-01", "2023-01-31")).toThrow("from과 to는 YYYYMMDD 형식이어야 합니다.");
    })

})


describe("Readme initParamsDate", ()=>{

    it("Normal case : 둘 다 일반적인 YYYYMMDD 형식이면 그대로 반환", () => {
        const result = initParamsDate("20230101", "20230131");
        expect(result).toEqual({ initFrom: "20230101", initTo: "20230131" });
    })

    it("Edge case : undefined이면 각각 30일 전과 오늘 날짜로 초기화" , ()=>{
        const result = initParamsDate(undefined, undefined);
        const expectedFrom = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0].replace(/-/g, '');
        const expectedTo = new Date().toISOString().split("T")[0].replace(/-/g, '');
        expect(result).toEqual({ initFrom: expectedFrom, initTo: expectedTo });
    })

    it("Error case : YYYYMMDD 형식이 아니면 에러 발생" , ()=>{
        expect(()=>initParamsDate("2023-01-01", "20230131")).toThrow("from과 to는 YYYYMMDD 형식이어야 합니다.");
        expect(()=>initParamsDate("20230101", "2023-01-31")).toThrow("from과 to는 YYYYMMDD 형식이어야 합니다.");
        expect(()=>initParamsDate("2023-01-01", "2023-01-31")).toThrow("from과 to는 YYYYMMDD 형식이어야 합니다.");
    })

})