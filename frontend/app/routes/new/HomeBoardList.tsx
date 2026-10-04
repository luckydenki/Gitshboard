interface BoardListItemProps {
    title: string;
    date: string;
}

const BoardListItem = ({ title, date }: BoardListItemProps) => {
    if (date)
        return (
            <li className="flex justify-between gap-4 border-b border-gray-300 py-2">
                <span>{title}</span> <span className="text-gray-500"> {date} </span>
            </li>
        );
    else {
        return (
            <li>
                <span className="text-gray-500"> 기대해주세요 </span>
            </li>
        );
    }
};

export interface HomeBoardListProps {
    boardTitle: string;
}

export default function HomeBoardList({ boardTitle }: HomeBoardListProps) {
    const data: BoardListItemProps[] = [
        {
            title: "깃허브 새 소식1",
            date: "날짜1",
        },
        {
            title: "깃허브 새 소식2",
            date: "날짜2",
        },
        {
            title: "깃허브 새 소식3",
            date: "날짜3",
        },
        {
            title: "깃허브 새 소식4",
            date: "날짜4",
        },
    ];

    if (data.length < 5) {
        const size = data.length;

        for (let i = 0; i < 5 - size; ++i) {
            data.push({
                title: "기대해주세요",
                date: "",
            });
        }
    }

    return (
        <div className="animate-fadeIn flex w-full flex-col gap-2 py-4">
            <h1 className="text-xl font-semibold">{boardTitle}</h1>
            <ul className="[&>li]:flex [&>li]:justify-between [&>li]:gap-4 [&>li]:border-b [&>li]:border-gray-300 [&>li]:py-2">
                {data.map((value) => {
                    return (
                        <BoardListItem
                            date={value.date}
                            title={value.title}
                            key={value.title}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
