import { Outlet } from "react-router";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardHeader from "./variant/DashboardHeader";



export type FloatState = "1" | "2" | "3";

export default function DashboardLayout(){

    const [queryClient] = useState(()=>new QueryClient()); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.


    return(
        <QueryClientProvider client ={queryClient}>
            <DashboardHeader/>
            <Outlet/>
            {/* <NavFloatButton 
                onFetchClick={(e)=>{ 
                    const value : FloatState= e.currentTarget.value as FloatState;
                    console.log("Fetch Button Clicked with value:", value);
                    setFloatState(value);
                    setResetTrigger(true); // Toggle resetTrigger to reset the timer
                }}
                render_time={render_time}
                /> */}
        </QueryClientProvider>
    )
}