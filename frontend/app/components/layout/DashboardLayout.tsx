import  {  useState } from "react";
import { Outlet } from "react-router";
import DashboardHeader from "./variant/DashboardHeader";
import { DashboardContext } from "~/stores/dashboardContext";


export default function DashboardLayout(){
    const [reRender, setReRender] = useState(false);

    

    return(
        <>
            <DashboardContext.Provider value={{ reRender, setReRender }}>
                <DashboardHeader/>
                <Outlet/>
            </DashboardContext.Provider>
        </>
    )
}