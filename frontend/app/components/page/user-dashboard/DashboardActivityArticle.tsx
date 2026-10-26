export default function DashboardActivityArticle() {
    return (
        <article className="bg-panel flex flex-col gap-4 px-4 py-4">
            <h4 className="text-md font-semibold">100일 연속 활동 중</h4>
            <div>총 커밋수 </div> <div></div>
            <div className="h-48 rounded-lg border border-gray-300 p-2">
                <h4 className="text-md">최근 일주일 간의 활동</h4>
                <div></div>
            </div>
            <div className="h-48 rounded-lg border border-gray-300 p-2">
                <h4 className="text-md">저장소 별 활동</h4>
                <div></div>
            </div>
        </article>
    );
}
