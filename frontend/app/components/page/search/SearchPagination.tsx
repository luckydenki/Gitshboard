import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router";

const pagesPerGroup = 10;
const arrowClassName =
    "bg-panel flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-500 enabled:hover:bg-primary/15 disabled:cursor-default disabled:opacity-50";

interface SearchPaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function SearchPagination({ currentPage, totalPages }: SearchPaginationProps) {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const firstPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
    const lastPage = Math.min(firstPage + pagesPerGroup - 1, totalPages);
    const pageNumbers = Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);

    const goToPage = (page: number) => {
        const nextParams = new URLSearchParams(params);
        nextParams.set("page", page.toString());
        navigate(`/search?${nextParams.toString()}`);
    };

    return (
        <footer
            className="flex max-w-full items-center gap-1 self-center"
            aria-label="검색 결과 페이지">
            <button
                type="button"
                className={arrowClassName}
                aria-label="이전 페이지 묶음"
                disabled={firstPage === 1}
                onClick={() => goToPage(firstPage - pagesPerGroup)}>
                <FiChevronLeft size={16} aria-hidden="true" />
            </button>

            <ol className="flex min-w-0 flex-wrap items-center justify-center gap-1">
                {pageNumbers.map((page) => (
                    <li key={page}>
                        <button
                            type="button"
                            aria-label={`${page}페이지`}
                            aria-pressed={currentPage === page}
                            onClick={() => goToPage(page)}
                            className="aria-[pressed=false]:hover:bg-primary/15 aria-pressed:bg-primary aria-pressed:hover:bg-primary/85 flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm tabular-nums aria-pressed:font-semibold aria-pressed:text-white">
                            {page}
                        </button>
                    </li>
                ))}
            </ol>

            <button
                type="button"
                className={arrowClassName}
                aria-label="다음 페이지 묶음"
                disabled={lastPage >= totalPages}
                onClick={() => goToPage(lastPage + 1)}>
                <FiChevronRight size={16} aria-hidden="true" />
            </button>
        </footer>
    );
}
