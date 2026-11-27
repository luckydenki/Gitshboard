import { Outlet } from "react-router";
import CommonHeader from "../components/common/CommonHeader";
import CommonFooter from "../components/common/CommonFooter";

export default function CommonLayout() {
    return (
        <div className="grid h-screen grid-rows-[4rem_1fr_auto]">
            <CommonHeader />
            <Outlet />
            <CommonFooter />
        </div>
    );
}
