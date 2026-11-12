interface BoardListItemProps {
    title: string;
    url: string;
    date: string;
    description: string;
}

const BoardListItem = ({ title, url, date, description }: BoardListItemProps) => {
    const splitdate = date.split(" ");

    const year = splitdate[3];
    const month = splitdate[2];
    const day = splitdate[1];

    const realdate = year + "." + month + "." + day;

    if (date)
        return (
            <li className="flex border-b border-gray-300">
                <a
                    href={url}
                    className="flex h-fit w-full flex-col gap-2 py-1"
                    title={title}>
                    <div className="line-clamp-1 w-full text-lg text-wrap hover:underline">
                        {title}
                    </div>

                    <div className="line-clamp-2 flex-5 pr-2 text-sm text-wrap text-gray-500">
                        {description}
                    </div>
                    <div className="flex h-8 w-full flex-1 items-end justify-end text-xs">
                        {realdate}
                    </div>
                </a>
            </li>
        );
    else {
        return (
            <li className="flex w-full py-2">
                <div>
                    <div className="text-gray-500"> 업데이트를 기대해주세요 </div>
                    <div className="min-h-6"></div>
                </div>
            </li>
        );
    }
};

export interface HomeBoardListProps {
    boardTitle: string;
    data: BoardListItemProps[];
    isLoading?: boolean;
}

export default function HomeBoardList({ boardTitle, data, isLoading = false }: HomeBoardListProps) {
    if (data.length > 0 && data.length < 5) {
        const size = data.length;

        for (let i = 0; i < 5 - size; ++i) {
            data.push({
                title: "기대해주세요",
                url: "",
                date: "",
                description: "",
            });
        }
    }

    //console.log("[HomeBoardList] data ", data);
    return (
        <div className="animate-fadeIn flex h-full w-full flex-col gap-2">
            <div className="flex justify-between">
                <h1 className="text-lg font-semibold">{boardTitle}</h1> <a href="#"> 더보기 </a>
            </div>
            {isLoading ? (
                <div
                    role="status"
                    className="bg-panel flex min-h-40 w-full flex-1 flex-col justify-center gap-3 rounded-lg p-4">
                    <span className="sr-only">{boardTitle} 목록을 불러오는 중입니다.</span>
                    <div
                        aria-hidden="true"
                        className="flex flex-col gap-3 divide-y divide-gray-200 motion-safe:animate-pulse">
                        {[0, 1].map((index) => (
                            <div key={index} className="flex flex-col gap-2 first:pb-3">
                                <div className="h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-16 self-end rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : data.length > 0 ? (
                <ul className="[&>li]:border-border-light bg-panel w-full rounded-lg px-4 py-4 [&>li]:flex [&>li]:justify-between [&>li]:gap-4 [&>li]:border-b [&>li]:py-2">
                    {data.map((value, idx) => {
                        return (
                            <BoardListItem
                                date={value.date}
                                url={value.url}
                                title={value.title}
                                description={value.description}
                                key={value.title + idx}
                            />
                        );
                    })}
                </ul>
            ) : (
                <div className="bg-panel flex h-full min-h-40 items-center justify-center rounded-lg p-4 text-gray-500">
                    {" "}
                    업데이트를 기대해주세요{" "}
                </div>
            )}
        </div>
    );
}
