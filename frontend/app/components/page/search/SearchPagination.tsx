import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arrowClassName =
    "bg-panel flex shrink-0 items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-500";

export default function SearchPagination() {
    const [selectedPage, setSelectedPage] = useState(1);

    return (
        <footer className="flex max-w-full items-center gap-1 self-center" aria-label="검색 결과 페이지">
            <span className={arrowClassName} aria-hidden="true">
                <FiChevronLeft size={16} />
            </span>

            <ol className="flex min-w-0 flex-wrap items-center justify-center gap-1">
                {pageNumbers.map((page) => (
                    <li key={page}>
                        <button
                            type="button"
                            aria-label={`${page}페이지`}
                            aria-pressed={selectedPage === page}
                            onClick={() => setSelectedPage(page)}
                            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm tabular-nums aria-pressed:bg-primary aria-pressed:font-semibold aria-pressed:text-white">
                            {page}
                        </button>
                    </li>
                ))}
            </ol>

            <span className={arrowClassName} aria-hidden="true">
                <FiChevronRight size={16} />
            </span>
        </footer>
    );
}
