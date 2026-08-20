import { Outlet } from "react-router";
import SearchHeader from "./variant/SearchHeader";





export default function QueryClientLayout() {

    return(
        <>
            <SearchHeader/>
            <Outlet/>
        </>

    )
}