import { beforeEach, describe, expect, it, vi } from "vitest";
import { compareDate } from "../app/components/page/contribution/ContributionDateInput";






describe("CompareDate", ()=>{

    //로그 안찍고 싶음 아래같이 설정합니다.
    beforeEach(() => {
         vi.spyOn(console, 'log').mockImplementation(() => {});
         //spyOn은 특정 객체의 메서드를 감시하고, 
         // 그 호출을 추적하거나 동작을 변경할 수 있는 기능을 제공합니다.
         //위 코드의 경우 console.log 메서드를 감시하고,
        // 그 호출을 가로채서 아무 동작도 수행하지 않도록 변경합니다.
        //mockImplementation(() => {})는 console.log가 호출될 때 아무 동작도 수행하지 않도록 설정합니다.
    });


    it("첫번째 값(from)과 두 번째 값(to)을 비교하여 첫번째 값이 더 크다면 false를 반환합니다.", () => {
        const date1 = "2023-01-02";
        const date2 = "2023-01-01";
        expect(compareDate(date1, date2)).toBe(false);
    });


    it("첫번째 값과 두 번째 값을 비교하여 첫번째 값이 더 작다면 true를 반환합니다.", () => {
        const date1 = "2023-01-01";
        const date2 = "2023-01-02";
        expect(compareDate(date1, date2)).toBe(true);
    });

    it("경계값 테스트 1 : 두 값이 1년 초과 차이 나면 false를 반환합니다.", () => {
        const date1 = "2021-12-31";
        const date2 = "2023-01-01";
        expect(compareDate(date1, date2)).toBe(false);
    });

    it("경계값 테스트 2 : 두 값이 정확히 1년 차이라면 true를 반환합니다.", () => {
        const date1 = "2022-01-01";
        const date2 = "2023-01-01";
        expect(compareDate(date1, date2)).toBe(true);
    });

    it("경계값 테스트 3 : 두 값이 같다면 true를 반환합니다.", ()=>{
        const date1 = "2023-01-01";
        const date2 = "2023-01-01";
        expect(compareDate(date1, date2)).toBe(true);
    })
    

    it("경계값 테스트 4 : 윤년의 경우 정확히 1년 차이가 나면 true를 반환합니다.", () => {
        const date1 = "2023-03-01";
        const date2 = "2024-03-01";
        expect(compareDate(date1, date2)).toBe(true);
    });


    it("경계값 테스트 5 : 윤년의 경우 366일이 초과되면 false를 반환합니다.", () => {
        const date1 = "2023-03-01";
        const date2 = "2024-03-02";
        expect(compareDate(date1, date2)).toBe(false);
    });


    it("경계값 테스트 6 : 윤년의 2월 29일을 시작으로 할 때 1년 뒤 날짜도 true를 처리합니다.", () => {
        const date1 = "2024-02-29";
        const date2 = "2025-02-28";

        expect(compareDate(date1, date2)).toBe(true);
    });


    it("경계값 테스트 7 : 2월 29일로부터 허용되는 최대 날짜를 확인합니다. 그 차이가 366일을 초과하면 false를 반환합니다.", () => {
        expect(compareDate("2024-02-29", "2025-03-01")).toBe(true);
        expect(compareDate("2024-02-29", "2025-03-02")).toBe(false);
    });

    it("날짜 변환이 불가능한 값을 보내면 에러를 반환해야 합니다.", () => {
        const date1 = "invalid-date";
        const date2 = "2023-01-01";
        expect(() => compareDate(date1, date2)).toThrow("Invalid date format");
    });


})

