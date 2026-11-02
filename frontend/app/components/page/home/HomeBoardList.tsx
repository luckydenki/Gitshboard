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
}

export default function HomeBoardList({ boardTitle, data }: HomeBoardListProps) {
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

    console.log("[HomeBoardList] data ", data);
    return (
        <div className="animate-fadeIn flex h-full w-full flex-col gap-2">
            <div className="flex justify-between">
                <h1 className="text-lg font-semibold">{boardTitle}</h1> <a href="#"> 더보기 </a>
            </div>
            {data.length > 0 ? (
                <ul className="[&>li]:border-border-light bg-panel rounded-lg px-4 py-4 [&>li]:flex [&>li]:justify-between [&>li]:gap-4 [&>li]:border-b [&>li]:py-2">
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
                <div className="bg-panel flex h-full items-center justify-center rounded-lg p-4 text-gray-500">
                    {" "}
                    업데이트를 기대해주세요{" "}
                </div>
            )}
        </div>
    );
}
