import { Outlet } from "react-router";
import { NavFloatButton } from "../common/NavFloatButton";
import useRenderingTimer from "~/hooks/dev/useRenderingTimer";
import { useState } from "react";



export type FloatState = "1" | "2" | "3";

export default function DashboardLayout(){
    const render_time = useRenderingTimer("DashboardLayout");
    const [floatState, setFloatState] = useState<FloatState>("1");
    console.log("Current Fetch Mode in DashboardLayout:", render_time);

    return(
        <>
            <Outlet context={[floatState, setFloatState]}/>
            <NavFloatButton 
                onFetchClick={(e)=>{ 
                    const value : FloatState= e.currentTarget.value as FloatState;
                    console.log("Fetch Button Clicked with value:", value);
                    setFloatState(value);
                }}
                render_time={render_time}
                />
        </>
    )
}