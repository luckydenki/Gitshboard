export default function SearchResultHeader({ total_count }: { total_count: number }) {
    return (
        <header>
            <h3 className="text-lg font-semibold">검색 결과 : {total_count}건</h3>
        </header>
    );
}

