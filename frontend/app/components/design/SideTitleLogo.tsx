import { Link } from "react-router";


/**
 * 사이드바에 표시되는 로고와 제목을 렌더링하는 버튼 컴포넌트입니다. 
 * 
 * @param param0 
 * 
 * @returns 
 */
export default function SideTitleLogo({ href ,onClick }: { href: string, onClick?: () => void }){
    return(
        <Link 
        className="flex items-center gap-3 hover:cursor-pointer" to={href} onClick={
            onClick
        }>
            <img src="/Gitshboard_alpha.png" alt="Gitshboard Logo" className="min-w-10 sm:hidden" />
            <span className="text-2xl font-bold  text-gray-500 dark:text-gray-400 not-sm:hidden">
                <span>Git</span>
                <span className="text-github-light">sh</span>
                <span>board</span>
            </span>
        </Link>

    )

}


