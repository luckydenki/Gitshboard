

interface SearchItemsProps {
    user: {
        login: string,
        id: number,
        avatar_url: string,
        html_url: string,
        type: "User" | "Organization"
    }
}

export function SearchItems({ user }: SearchItemsProps){

    return(
         <article key={user.id} className="flex flex-col">
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                <div className={`
                        flex items-center gap-6 justify-between px-6 py-4
                        min-w-80
                        rounded-[1.75rem]
                        bg-white  shadow-md
                        hover:bg-gray-100 dark:hover:bg-gray-800
                    `}>
                    <img src={user.avatar_url} alt={`${user.login}'s avatar`}
                        width={50} height={50}
                        className="rounded-full border-2 border-gray-400"
                        />
                        <div className="flex flex-col gap-1 items-end">
                        <span className="text-xl not-sm:text-md">{user.login}</span>
                        <span className={`px-2
                            text-sm text-center
                            not-sm:text-xs
                            rounded-full
                            bg-gray-300`}>{user.type}</span>
                    </div>
                </div>
            </a>
        </article>
    )
}