import { Link } from "react-router";

/**
 * 사이드바에 표시되는 로고와 제목을 렌더링하는 버튼 컴포넌트입니다.
 *
 * @param param0
 *
 * @returns
 */
export default function SideTitleLogo({ href, onClick }: { href: string; onClick?: () => void }) {
    return (
        <Link
            className="flex items-center gap-3 hover:cursor-pointer"
            to={href}
            onClick={onClick}>
            <span className="text- text-2xl font-bold not-sm:hidden dark:text-gray-400">
                <span>Git</span>
                <span className="text-primary">sh</span>
                <span>board</span>
            </span>
        </Link>
    );
}
