
import useUserHeader from "~/hooks/useUserHeader";


export default function ProfileButton(){
    

    const { data, error, isLoading, isError} = useUserHeader();

    if(isLoading || isError){
        return (
            <button className="flex w-fit items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-gray-900">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <span className="overflow-hidden text-sm font-medium text-gray-700 dark:text-gray-200 not-sm:hidden">Loading...</span>
            </button>
        )
    }   


    return(
        <button className="flex w-fit items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-gray-900">
            <img
                src={data?.avatarUrl}
                alt="avatar"
                fetchPriority="high"
                className="h-8 w-8 rounded-full"
            />
            <span className="overflow-hidden text-sm font-medium text-gray-700 dark:text-gray-200 not-sm:hidden">{data?.login}</span>
        </button>
    )
}