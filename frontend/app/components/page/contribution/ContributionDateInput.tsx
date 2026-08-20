import { useRef } from "react";

/**
 * 
 * 두 날짜 from 과 to를 비교합니다.
 * 
 * 1. from 보다 to가 더 크거나 같으면 true를 반환합니다.
 * 2. from 보다 to가 더 작으면 false를 반환합니다.
 * 3. 두 날짜의 차이가 1년 이상이면 false를 반환합니다.
 * 
 * 참고로 1년의 정의는 그냥 365일이 아닌 윤년을 고려한 1년으로 정의합니다.
 * 
 * 
 * @param date1 
 * @param date2 
 * @returns 
 */
export const compareDate = (from: string, to: string): boolean => {

    if (isNaN(new Date(from).getTime()) || isNaN(new Date(to).getTime())) {
        throw new Error("Invalid date format");
    }

    const from_d = new Date(from);
    const to_d = new Date(to);


    console.log("from_d.getTime() : ", from_d.getTime());
    console.log("to_d.getTime() : ", to_d.getTime());
    


    if(from_d.getTime() > to_d.getTime()){
        return false;
    }

    //이 방식은 윤년 케이스를 고려 못함, 윤년은 1년이 366일이기 때문.
    // 차라리 1년을 더해주는 방식으로 구해봄
    // if(Math.abs(from_d.getTime() - to_d.getTime()) > 365 * 24 * 60 * 60 * 1000) {
    //     return false;
    // }


    const oneYearLater = new Date(from_d);

    console.log("oneYearLater.getFullYear() : ", oneYearLater.getFullYear());
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (to_d.getTime() > oneYearLater.getTime()) {
        return false;
    }

    return true;
}

export default function ContributionDateInput({ from , to, setFromState, setToState } : { from: string, to: string, setFromState: (value: string) => void, setToState: (value: string) => void }) {


    const fromRef = useRef(from);
    const toRef = useRef(to);



    return (
            <div className="flex gap-2 justify-end bg-white rounded-2xl p-4 [&>div]:p-1 [&>div]:border [&>div]:rounded-lg [&>div]:border-gray-300">

                    <div>
                        <span> from :</span>
                        <input type="date" defaultValue={from}
                            onChange={(e)=>{
                                    const newFrom = new Date(e.target.value).toISOString();

                                    if(new Date(newFrom).getTime() > new Date(toRef.current).getTime()) {
                                        alert("From date cannot be later than To date.");
                                        fromRef.current = toRef.current;
                                        e.target.value = new Date(toRef.current).toISOString().split("T")[0];
                                        return;
                                    }
                                    fromRef.current = newFrom; 
                            }}
                        />
                    </div>
                    <div>
                        <span> to :</span>
                        <input type="date" defaultValue={to}
                            onChange={(e)=>{
                                const newTo = new Date(e.target.value).toISOString();

                                if(new Date(newTo).getTime() < new Date(fromRef.current).getTime()) {
                                    alert("To date cannot be earlier than From date.");
                                    toRef.current = fromRef.current;
                                    e.target.value = new Date(fromRef.current).toISOString().split("T")[0];
                                    return;
                                }
                                toRef.current = newTo; 
                            }}
                        />
                    </div>

                     <input type="button" value="Refresh" onClick={()=>{
                        setFromState(fromRef.current);
                        setToState(toRef.current);
                     }} 
                     
                       className={`rounded-2xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
                     />

         </div>

    )


}