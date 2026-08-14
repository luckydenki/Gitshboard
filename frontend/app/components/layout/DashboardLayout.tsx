import { Outlet } from "react-router";
import DashboardHeader from "./variant/DashboardHeader";



export type FloatState = "1" | "2" | "3";

export default function DashboardLayout(){



    return(
        <>
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

        </>
    )
}