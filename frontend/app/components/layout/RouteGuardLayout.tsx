import { Navigate, Outlet } from "react-router";
import useAuthCheck from "~/hooks/useAuthCheck";







export default function RouteGuardLayout() {

    const {  isSuccess, isLoading, refetch }= useAuthCheck();

    console.log("RouteGuardLayout isSuccess : ", isSuccess);

    if(isLoading){
        return(
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
            </div>
        )
    }

    if(!isSuccess){
        return <Navigate to="/" replace={true}/>
    }

    return (
        <Outlet context={refetch}/>
    )

}