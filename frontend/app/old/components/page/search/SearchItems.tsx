interface SearchItemsProps {
    user: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
        type: "User" | "Organization";
    };
}

export function SearchItems({ user }: SearchItemsProps) {
    return (
        <article
            key={user.id}
            className="flex flex-col">
            <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer">
                <div
                    className={`flex min-w-80 items-center justify-between gap-6 rounded-[1.75rem] bg-white px-6 py-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800`}>
                    <img
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-gray-400"
                    />
                    <div className="flex flex-col items-end gap-1">
                        <span className="not-sm:text-md text-xl">{user.login}</span>
                        <span
                            className={`rounded-full bg-gray-300 px-2 text-center text-sm not-sm:text-xs`}>
                            {user.type}
                        </span>
                    </div>
                </div>
            </a>
        </article>
    );
}
