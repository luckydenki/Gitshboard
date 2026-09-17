// 컴포넌트의 로딩 상태 표시를 위한 컴포넌트인데, 추후 사용을 위해 예시 및 저장 용으로 만들어놓은 것
export function ComponentPlaceholder() {
    return (
        <div>
            {/* Pinned Repositories (placeholder) */}
            <section className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-4 font-semibold text-white">Pinned Repositories</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-2 rounded-md border border-gray-700 p-4">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-700" />
                            <div className="h-3 w-full animate-pulse rounded bg-gray-800" />
                            <div className="h-3 w-4/5 animate-pulse rounded bg-gray-800" />
                            <div className="mt-1 flex gap-3">
                                <div className="h-3 w-12 animate-pulse rounded bg-gray-700" />
                                <div className="h-3 w-10 animate-pulse rounded bg-gray-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Activity (placeholder) */}
            <section className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-4 font-semibold text-white">Recent Activity</h2>
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3">
                            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-700" />
                            <div className="flex flex-1 flex-col gap-1">
                                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-700" />
                                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
