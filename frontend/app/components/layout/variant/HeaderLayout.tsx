import { useNavigate } from "react-router";
import SideTitleLogo from "../../design/SideTitleLogo";



export default function HeaderLayout({children, onClick} : {children? : React.ReactNode, onClick : ()=>void}){

    return(
        <header className="sticky top-0 z-10 bg-white/80 px-6 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-gray-950/70">
            <div className="mx-auto flex max-w-360 items-center justify-between">
                <SideTitleLogo onClick={onClick}/>
                 {children}
            </div>
        </header>
    )
}
//아바타 url, 로그인 명