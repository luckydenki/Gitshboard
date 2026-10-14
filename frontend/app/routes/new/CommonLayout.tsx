import { Outlet } from "react-router";
import CommonFooter from "./common/CommonFooter";
import CommonHeader from "./common/CommonHeader";

export default function CommonLayout() {
    return (
        <div className='grid h-screen grid-rows-[60px_7fr_auto] [grid-template-areas:"header"_"main"_"footer"]'>
            <CommonHeader />
            <Outlet />
            <CommonFooter />
        </div>
    );
}
