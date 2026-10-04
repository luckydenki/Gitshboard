import { useSearchParams } from "react-router";
import "../routes/search.css";
import { useRef, useState } from "react";
import SearchForm from "~/components/page/home/SearchForm";
import SearchTitle from "~/components/page/search/SearchTitle";
import SearchCategorySelect from "~/components/page/search/SearchCategorySelect";
import SearchPagination from "~/components/page/search/SearchPagination";
import { useSearchQuery, useFilteringItems, useSearchPagination } from "~/hooks/pages/search-hooks";
import { SearchItems } from "~/components/page/search/SearchItems";

function PageButton({
    pageNumber,
    isActive,
    onClick,
}: {
    pageNumber: number;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={`h-12 w-12 ${isActive ? "bg-gray-300" : "bg-white"} text-center not-sm:h-8 not-sm:w-8 not-sm:text-xs not-disabled:hover:bg-gray-400`}
            onClick={onClick}
            disabled={isActive}>
            {pageNumber}
        </button>
    );
}

export default function Search() {
    const [searchParams] = useSearchParams();
    const per_page = useRef(10);
    const [category, SetCategory] = useState("all");

    const name: string = searchParams.get("name") ?? "";
    const page: string = searchParams.get("page") ?? "1";

    const { data, isLoading, isError } = useSearchQuery({
        name: name,
        page: Number(page),
        per_page: per_page,
    });

    const a = { asdasd: "asd", asd: "vqe" };

    const { filter_items } = useFilteringItems({ category, data, isLoading });

    const { PaginationButton } = useSearchPagination({
        data,
        page,
        per_page,
        name,
        PageButton,
    });

    //Log("frontend data" ,data);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error occurred while fetching data.</div>;
    }

    return (
        <div className="flex h-full min-h-screen flex-col gap-4 px-6 py-6 not-sm:px-4 lg:px-8">
            <section className="flex w-full max-w-7xl flex-col gap-4 self-center py-4">
                <SearchTitle name={name} />
                <section>
                    <div
                        className={`flex justify-between gap-4 not-sm:flex-col-reverse not-sm:items-start not-sm:gap-4`}>
                        <SearchCategorySelect setCategory={SetCategory} />
                        <SearchForm />
                    </div>
                </section>

                {filter_items.length === 0 ? (
                    <h3 className="flex justify-center py-4 text-xl">There is no results.</h3>
                ) : (
                    filter_items.map((user) => {
                        return (
                            <SearchItems
                                key={user.id}
                                user={user}
                            />
                        );
                    })
                )}

                <SearchPagination
                    name={name}
                    page={page}
                    data={data}>
                    {PaginationButton}
                </SearchPagination>
            </section>
        </div>
    );
}
