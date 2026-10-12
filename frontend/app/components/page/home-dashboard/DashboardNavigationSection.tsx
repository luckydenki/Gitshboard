export default function DashboardNavigationSection() {
    return (
        <section className="border-lg bg-panel flex gap-4 px-4 py-2">
            <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                최근 활동
            </button>
            <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">성향</button>
            <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                레포지토리
            </button>

            <button className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200">
                기술 동향
            </button>
        </section>
    );
}
