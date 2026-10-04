import { Outlet } from "react-router";
import CommonFooter from "./CommonFooter";
import CommonHeader from "./CommonHeader";

export default function CommonLayout() {
    return (
        <div className='w-100% grid h-screen grid-rows-[60px_7fr_auto] [grid-template-areas:"header_header_header"_"main_main_main"_"footer_footer_footer"]'>
            <CommonHeader />
            <Outlet />
            <CommonFooter />
        </div>
    );
}
