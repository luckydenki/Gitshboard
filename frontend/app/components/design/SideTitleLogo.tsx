

/**
 * 사이드바에 표시되는 로고와 제목을 렌더링하는 버튼 컴포넌트입니다. 
 * 
 * @param param0 
 * 
 * @returns 
 */
export default function SideTitleLogo({ onClick }: { onClick: () => void }){
    return(
        <button className="flex items-center gap-3 hover:cursor-pointer" onClick={
            onClick
        }>
            <img src="/Gitshboard_alpha.png" alt="Gitshboard Logo" className="w-10 sm:hidden" />
            <span className="text-2xl font-bold  text-gray-500 dark:text-gray-400 not-sm:hidden">
                <span>Git</span>
                <span className="text-github-light">sh</span>
                <span>board</span>
            </span>
        </button>

    )

}


