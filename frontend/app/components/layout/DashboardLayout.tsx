import { Outlet } from "react-router";
import DashboardHeader from "./variant/DashboardHeader";


export default function DashboardLayout(){
    return(
        <>
            <DashboardHeader/>
            <Outlet/>
        </>
    )
}