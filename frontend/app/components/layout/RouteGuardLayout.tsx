import { Navigate, Outlet } from "react-router";
import useAuthCheck from "~/hooks/useAuthCheck";

export default function RouteGuardLayout() {
    const { isSuccess, isLoading, refetch } = useAuthCheck();

    //console.log("RouteGuardLayout isSuccess : ", isSuccess);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed dark:border-violet-400"></div>
            </div>
        );
    }

    if (!isSuccess) {
        return (
            <Navigate
                to="/"
                replace={true}
            />
        );
    }

    return <Outlet context={refetch} />;
}
